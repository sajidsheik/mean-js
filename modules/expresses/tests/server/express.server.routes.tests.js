'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Express = mongoose.model('Express'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  express;

/**
 * Express routes tests
 */
describe('Express CRUD tests', function () {

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

    // Save a user to the test db and create new Express
    user.save(function () {
      express = {
        name: 'Express name'
      };

      done();
    });
  });

  it('should be able to save a Express if logged in', function (done) {
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

        // Save a new Express
        agent.post('/api/expresses')
          .send(express)
          .expect(200)
          .end(function (expressSaveErr, expressSaveRes) {
            // Handle Express save error
            if (expressSaveErr) {
              return done(expressSaveErr);
            }

            // Get a list of Expresses
            agent.get('/api/expresses')
              .end(function (expressesGetErr, expressesGetRes) {
                // Handle Expresses save error
                if (expressesGetErr) {
                  return done(expressesGetErr);
                }

                // Get Expresses list
                var expresses = expressesGetRes.body;

                // Set assertions
                (expresses[0].user._id).should.equal(userId);
                (expresses[0].name).should.match('Express name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Express if not logged in', function (done) {
    agent.post('/api/expresses')
      .send(express)
      .expect(403)
      .end(function (expressSaveErr, expressSaveRes) {
        // Call the assertion callback
        done(expressSaveErr);
      });
  });

  it('should not be able to save an Express if no name is provided', function (done) {
    // Invalidate name field
    express.name = '';

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

        // Save a new Express
        agent.post('/api/expresses')
          .send(express)
          .expect(400)
          .end(function (expressSaveErr, expressSaveRes) {
            // Set message assertion
            (expressSaveRes.body.message).should.match('Please fill Express name');

            // Handle Express save error
            done(expressSaveErr);
          });
      });
  });

  it('should be able to update an Express if signed in', function (done) {
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

        // Save a new Express
        agent.post('/api/expresses')
          .send(express)
          .expect(200)
          .end(function (expressSaveErr, expressSaveRes) {
            // Handle Express save error
            if (expressSaveErr) {
              return done(expressSaveErr);
            }

            // Update Express name
            express.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Express
            agent.put('/api/expresses/' + expressSaveRes.body._id)
              .send(express)
              .expect(200)
              .end(function (expressUpdateErr, expressUpdateRes) {
                // Handle Express update error
                if (expressUpdateErr) {
                  return done(expressUpdateErr);
                }

                // Set assertions
                (expressUpdateRes.body._id).should.equal(expressSaveRes.body._id);
                (expressUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Expresses if not signed in', function (done) {
    // Create new Express model instance
    var expressObj = new Express(express);

    // Save the express
    expressObj.save(function () {
      // Request Expresses
      request(app).get('/api/expresses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Express if not signed in', function (done) {
    // Create new Express model instance
    var expressObj = new Express(express);

    // Save the Express
    expressObj.save(function () {
      request(app).get('/api/expresses/' + expressObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', express.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Express with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/expresses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Express is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Express which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Express
    request(app).get('/api/expresses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Express with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Express if signed in', function (done) {
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

        // Save a new Express
        agent.post('/api/expresses')
          .send(express)
          .expect(200)
          .end(function (expressSaveErr, expressSaveRes) {
            // Handle Express save error
            if (expressSaveErr) {
              return done(expressSaveErr);
            }

            // Delete an existing Express
            agent.delete('/api/expresses/' + expressSaveRes.body._id)
              .send(express)
              .expect(200)
              .end(function (expressDeleteErr, expressDeleteRes) {
                // Handle express error error
                if (expressDeleteErr) {
                  return done(expressDeleteErr);
                }

                // Set assertions
                (expressDeleteRes.body._id).should.equal(expressSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Express if not signed in', function (done) {
    // Set Express user
    express.user = user;

    // Create new Express model instance
    var expressObj = new Express(express);

    // Save the Express
    expressObj.save(function () {
      // Try deleting Express
      request(app).delete('/api/expresses/' + expressObj._id)
        .expect(403)
        .end(function (expressDeleteErr, expressDeleteRes) {
          // Set message assertion
          (expressDeleteRes.body.message).should.match('User is not authorized');

          // Handle Express error error
          done(expressDeleteErr);
        });

    });
  });

  it('should be able to get a single Express that has an orphaned user reference', function (done) {
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

          // Save a new Express
          agent.post('/api/expresses')
            .send(express)
            .expect(200)
            .end(function (expressSaveErr, expressSaveRes) {
              // Handle Express save error
              if (expressSaveErr) {
                return done(expressSaveErr);
              }

              // Set assertions on new Express
              (expressSaveRes.body.name).should.equal(express.name);
              should.exist(expressSaveRes.body.user);
              should.equal(expressSaveRes.body.user._id, orphanId);

              // force the Express to have an orphaned user reference
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

                    // Get the Express
                    agent.get('/api/expresses/' + expressSaveRes.body._id)
                      .expect(200)
                      .end(function (expressInfoErr, expressInfoRes) {
                        // Handle Express error
                        if (expressInfoErr) {
                          return done(expressInfoErr);
                        }

                        // Set assertions
                        (expressInfoRes.body._id).should.equal(expressSaveRes.body._id);
                        (expressInfoRes.body.name).should.equal(express.name);
                        should.equal(expressInfoRes.body.user, undefined);

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
      Express.remove().exec(done);
    });
  });
});
