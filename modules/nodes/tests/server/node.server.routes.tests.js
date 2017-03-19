'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Node = mongoose.model('Node'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  node;

/**
 * Node routes tests
 */
describe('Node CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Node
    user.save(function () {
      node = {
        name: 'Node name'
      };

      done();
    });
  });

  it('should be able to save a Node if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Node
        agent.post('/api/nodes')
          .send(node)
          .expect(200)
          .end(function (nodeSaveErr, nodeSaveRes) {
            // Handle Node save error
            if (nodeSaveErr) {
              return done(nodeSaveErr);
            }

            // Get a list of Nodes
            agent.get('/api/nodes')
              .end(function (nodesGetErr, nodesGetRes) {
                // Handle Nodes save error
                if (nodesGetErr) {
                  return done(nodesGetErr);
                }

                // Get Nodes list
                var nodes = nodesGetRes.body;

                // Set assertions
                (nodes[0].user._id).should.equal(userId);
                (nodes[0].name).should.match('Node name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Node if not logged in', function (done) {
    agent.post('/api/nodes')
      .send(node)
      .expect(403)
      .end(function (nodeSaveErr, nodeSaveRes) {
        // Call the assertion callback
        done(nodeSaveErr);
      });
  });

  it('should not be able to save an Node if no name is provided', function (done) {
    // Invalidate name field
    node.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Node
        agent.post('/api/nodes')
          .send(node)
          .expect(400)
          .end(function (nodeSaveErr, nodeSaveRes) {
            // Set message assertion
            (nodeSaveRes.body.message).should.match('Please fill Node name');

            // Handle Node save error
            done(nodeSaveErr);
          });
      });
  });

  it('should be able to update an Node if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Node
        agent.post('/api/nodes')
          .send(node)
          .expect(200)
          .end(function (nodeSaveErr, nodeSaveRes) {
            // Handle Node save error
            if (nodeSaveErr) {
              return done(nodeSaveErr);
            }

            // Update Node name
            node.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Node
            agent.put('/api/nodes/' + nodeSaveRes.body._id)
              .send(node)
              .expect(200)
              .end(function (nodeUpdateErr, nodeUpdateRes) {
                // Handle Node update error
                if (nodeUpdateErr) {
                  return done(nodeUpdateErr);
                }

                // Set assertions
                (nodeUpdateRes.body._id).should.equal(nodeSaveRes.body._id);
                (nodeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Nodes if not signed in', function (done) {
    // Create new Node model instance
    var nodeObj = new Node(node);

    // Save the node
    nodeObj.save(function () {
      // Request Nodes
      request(app).get('/api/nodes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Node if not signed in', function (done) {
    // Create new Node model instance
    var nodeObj = new Node(node);

    // Save the Node
    nodeObj.save(function () {
      request(app).get('/api/nodes/' + nodeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', node.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Node with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/nodes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Node is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Node which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Node
    request(app).get('/api/nodes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Node with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Node if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Node
        agent.post('/api/nodes')
          .send(node)
          .expect(200)
          .end(function (nodeSaveErr, nodeSaveRes) {
            // Handle Node save error
            if (nodeSaveErr) {
              return done(nodeSaveErr);
            }

            // Delete an existing Node
            agent.delete('/api/nodes/' + nodeSaveRes.body._id)
              .send(node)
              .expect(200)
              .end(function (nodeDeleteErr, nodeDeleteRes) {
                // Handle node error error
                if (nodeDeleteErr) {
                  return done(nodeDeleteErr);
                }

                // Set assertions
                (nodeDeleteRes.body._id).should.equal(nodeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Node if not signed in', function (done) {
    // Set Node user
    node.user = user;

    // Create new Node model instance
    var nodeObj = new Node(node);

    // Save the Node
    nodeObj.save(function () {
      // Try deleting Node
      request(app).delete('/api/nodes/' + nodeObj._id)
        .expect(403)
        .end(function (nodeDeleteErr, nodeDeleteRes) {
          // Set message assertion
          (nodeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Node error error
          done(nodeDeleteErr);
        });

    });
  });

  it('should be able to get a single Node that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Node
          agent.post('/api/nodes')
            .send(node)
            .expect(200)
            .end(function (nodeSaveErr, nodeSaveRes) {
              // Handle Node save error
              if (nodeSaveErr) {
                return done(nodeSaveErr);
              }

              // Set assertions on new Node
              (nodeSaveRes.body.name).should.equal(node.name);
              should.exist(nodeSaveRes.body.user);
              should.equal(nodeSaveRes.body.user._id, orphanId);

              // force the Node to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Node
                    agent.get('/api/nodes/' + nodeSaveRes.body._id)
                      .expect(200)
                      .end(function (nodeInfoErr, nodeInfoRes) {
                        // Handle Node error
                        if (nodeInfoErr) {
                          return done(nodeInfoErr);
                        }

                        // Set assertions
                        (nodeInfoRes.body._id).should.equal(nodeSaveRes.body._id);
                        (nodeInfoRes.body.name).should.equal(node.name);
                        should.equal(nodeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Node.remove().exec(done);
    });
  });
});
