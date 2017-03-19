'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Angularj = mongoose.model('Angularj'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  angularj;

/**
 * Angularj routes tests
 */
describe('Angularj CRUD tests', function () {

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

    // Save a user to the test db and create new Angularj
    user.save(function () {
      angularj = {
        name: 'Angularj name'
      };

      done();
    });
  });

  it('should be able to save a Angularj if logged in', function (done) {
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

        // Save a new Angularj
        agent.post('/api/angularjs')
          .send(angularj)
          .expect(200)
          .end(function (angularjSaveErr, angularjSaveRes) {
            // Handle Angularj save error
            if (angularjSaveErr) {
              return done(angularjSaveErr);
            }

            // Get a list of Angularjs
            agent.get('/api/angularjs')
              .end(function (angularjsGetErr, angularjsGetRes) {
                // Handle Angularjs save error
                if (angularjsGetErr) {
                  return done(angularjsGetErr);
                }

                // Get Angularjs list
                var angularjs = angularjsGetRes.body;

                // Set assertions
                (angularjs[0].user._id).should.equal(userId);
                (angularjs[0].name).should.match('Angularj name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Angularj if not logged in', function (done) {
    agent.post('/api/angularjs')
      .send(angularj)
      .expect(403)
      .end(function (angularjSaveErr, angularjSaveRes) {
        // Call the assertion callback
        done(angularjSaveErr);
      });
  });

  it('should not be able to save an Angularj if no name is provided', function (done) {
    // Invalidate name field
    angularj.name = '';

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

        // Save a new Angularj
        agent.post('/api/angularjs')
          .send(angularj)
          .expect(400)
          .end(function (angularjSaveErr, angularjSaveRes) {
            // Set message assertion
            (angularjSaveRes.body.message).should.match('Please fill Angularj name');

            // Handle Angularj save error
            done(angularjSaveErr);
          });
      });
  });

  it('should be able to update an Angularj if signed in', function (done) {
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

        // Save a new Angularj
        agent.post('/api/angularjs')
          .send(angularj)
          .expect(200)
          .end(function (angularjSaveErr, angularjSaveRes) {
            // Handle Angularj save error
            if (angularjSaveErr) {
              return done(angularjSaveErr);
            }

            // Update Angularj name
            angularj.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Angularj
            agent.put('/api/angularjs/' + angularjSaveRes.body._id)
              .send(angularj)
              .expect(200)
              .end(function (angularjUpdateErr, angularjUpdateRes) {
                // Handle Angularj update error
                if (angularjUpdateErr) {
                  return done(angularjUpdateErr);
                }

                // Set assertions
                (angularjUpdateRes.body._id).should.equal(angularjSaveRes.body._id);
                (angularjUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Angularjs if not signed in', function (done) {
    // Create new Angularj model instance
    var angularjObj = new Angularj(angularj);

    // Save the angularj
    angularjObj.save(function () {
      // Request Angularjs
      request(app).get('/api/angularjs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Angularj if not signed in', function (done) {
    // Create new Angularj model instance
    var angularjObj = new Angularj(angularj);

    // Save the Angularj
    angularjObj.save(function () {
      request(app).get('/api/angularjs/' + angularjObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', angularj.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Angularj with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/angularjs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Angularj is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Angularj which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Angularj
    request(app).get('/api/angularjs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Angularj with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Angularj if signed in', function (done) {
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

        // Save a new Angularj
        agent.post('/api/angularjs')
          .send(angularj)
          .expect(200)
          .end(function (angularjSaveErr, angularjSaveRes) {
            // Handle Angularj save error
            if (angularjSaveErr) {
              return done(angularjSaveErr);
            }

            // Delete an existing Angularj
            agent.delete('/api/angularjs/' + angularjSaveRes.body._id)
              .send(angularj)
              .expect(200)
              .end(function (angularjDeleteErr, angularjDeleteRes) {
                // Handle angularj error error
                if (angularjDeleteErr) {
                  return done(angularjDeleteErr);
                }

                // Set assertions
                (angularjDeleteRes.body._id).should.equal(angularjSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Angularj if not signed in', function (done) {
    // Set Angularj user
    angularj.user = user;

    // Create new Angularj model instance
    var angularjObj = new Angularj(angularj);

    // Save the Angularj
    angularjObj.save(function () {
      // Try deleting Angularj
      request(app).delete('/api/angularjs/' + angularjObj._id)
        .expect(403)
        .end(function (angularjDeleteErr, angularjDeleteRes) {
          // Set message assertion
          (angularjDeleteRes.body.message).should.match('User is not authorized');

          // Handle Angularj error error
          done(angularjDeleteErr);
        });

    });
  });

  it('should be able to get a single Angularj that has an orphaned user reference', function (done) {
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

          // Save a new Angularj
          agent.post('/api/angularjs')
            .send(angularj)
            .expect(200)
            .end(function (angularjSaveErr, angularjSaveRes) {
              // Handle Angularj save error
              if (angularjSaveErr) {
                return done(angularjSaveErr);
              }

              // Set assertions on new Angularj
              (angularjSaveRes.body.name).should.equal(angularj.name);
              should.exist(angularjSaveRes.body.user);
              should.equal(angularjSaveRes.body.user._id, orphanId);

              // force the Angularj to have an orphaned user reference
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

                    // Get the Angularj
                    agent.get('/api/angularjs/' + angularjSaveRes.body._id)
                      .expect(200)
                      .end(function (angularjInfoErr, angularjInfoRes) {
                        // Handle Angularj error
                        if (angularjInfoErr) {
                          return done(angularjInfoErr);
                        }

                        // Set assertions
                        (angularjInfoRes.body._id).should.equal(angularjSaveRes.body._id);
                        (angularjInfoRes.body.name).should.equal(angularj.name);
                        should.equal(angularjInfoRes.body.user, undefined);

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
      Angularj.remove().exec(done);
    });
  });
});
