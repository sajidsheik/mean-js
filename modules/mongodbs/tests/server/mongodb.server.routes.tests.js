'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mongodb = mongoose.model('Mongodb'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  mongodb;

/**
 * Mongodb routes tests
 */
describe('Mongodb CRUD tests', function () {

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

    // Save a user to the test db and create new Mongodb
    user.save(function () {
      mongodb = {
        name: 'Mongodb name'
      };

      done();
    });
  });

  it('should be able to save a Mongodb if logged in', function (done) {
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

        // Save a new Mongodb
        agent.post('/api/mongodbs')
          .send(mongodb)
          .expect(200)
          .end(function (mongodbSaveErr, mongodbSaveRes) {
            // Handle Mongodb save error
            if (mongodbSaveErr) {
              return done(mongodbSaveErr);
            }

            // Get a list of Mongodbs
            agent.get('/api/mongodbs')
              .end(function (mongodbsGetErr, mongodbsGetRes) {
                // Handle Mongodbs save error
                if (mongodbsGetErr) {
                  return done(mongodbsGetErr);
                }

                // Get Mongodbs list
                var mongodbs = mongodbsGetRes.body;

                // Set assertions
                (mongodbs[0].user._id).should.equal(userId);
                (mongodbs[0].name).should.match('Mongodb name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mongodb if not logged in', function (done) {
    agent.post('/api/mongodbs')
      .send(mongodb)
      .expect(403)
      .end(function (mongodbSaveErr, mongodbSaveRes) {
        // Call the assertion callback
        done(mongodbSaveErr);
      });
  });

  it('should not be able to save an Mongodb if no name is provided', function (done) {
    // Invalidate name field
    mongodb.name = '';

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

        // Save a new Mongodb
        agent.post('/api/mongodbs')
          .send(mongodb)
          .expect(400)
          .end(function (mongodbSaveErr, mongodbSaveRes) {
            // Set message assertion
            (mongodbSaveRes.body.message).should.match('Please fill Mongodb name');

            // Handle Mongodb save error
            done(mongodbSaveErr);
          });
      });
  });

  it('should be able to update an Mongodb if signed in', function (done) {
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

        // Save a new Mongodb
        agent.post('/api/mongodbs')
          .send(mongodb)
          .expect(200)
          .end(function (mongodbSaveErr, mongodbSaveRes) {
            // Handle Mongodb save error
            if (mongodbSaveErr) {
              return done(mongodbSaveErr);
            }

            // Update Mongodb name
            mongodb.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mongodb
            agent.put('/api/mongodbs/' + mongodbSaveRes.body._id)
              .send(mongodb)
              .expect(200)
              .end(function (mongodbUpdateErr, mongodbUpdateRes) {
                // Handle Mongodb update error
                if (mongodbUpdateErr) {
                  return done(mongodbUpdateErr);
                }

                // Set assertions
                (mongodbUpdateRes.body._id).should.equal(mongodbSaveRes.body._id);
                (mongodbUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mongodbs if not signed in', function (done) {
    // Create new Mongodb model instance
    var mongodbObj = new Mongodb(mongodb);

    // Save the mongodb
    mongodbObj.save(function () {
      // Request Mongodbs
      request(app).get('/api/mongodbs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mongodb if not signed in', function (done) {
    // Create new Mongodb model instance
    var mongodbObj = new Mongodb(mongodb);

    // Save the Mongodb
    mongodbObj.save(function () {
      request(app).get('/api/mongodbs/' + mongodbObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', mongodb.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mongodb with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mongodbs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mongodb is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mongodb which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mongodb
    request(app).get('/api/mongodbs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mongodb with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mongodb if signed in', function (done) {
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

        // Save a new Mongodb
        agent.post('/api/mongodbs')
          .send(mongodb)
          .expect(200)
          .end(function (mongodbSaveErr, mongodbSaveRes) {
            // Handle Mongodb save error
            if (mongodbSaveErr) {
              return done(mongodbSaveErr);
            }

            // Delete an existing Mongodb
            agent.delete('/api/mongodbs/' + mongodbSaveRes.body._id)
              .send(mongodb)
              .expect(200)
              .end(function (mongodbDeleteErr, mongodbDeleteRes) {
                // Handle mongodb error error
                if (mongodbDeleteErr) {
                  return done(mongodbDeleteErr);
                }

                // Set assertions
                (mongodbDeleteRes.body._id).should.equal(mongodbSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mongodb if not signed in', function (done) {
    // Set Mongodb user
    mongodb.user = user;

    // Create new Mongodb model instance
    var mongodbObj = new Mongodb(mongodb);

    // Save the Mongodb
    mongodbObj.save(function () {
      // Try deleting Mongodb
      request(app).delete('/api/mongodbs/' + mongodbObj._id)
        .expect(403)
        .end(function (mongodbDeleteErr, mongodbDeleteRes) {
          // Set message assertion
          (mongodbDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mongodb error error
          done(mongodbDeleteErr);
        });

    });
  });

  it('should be able to get a single Mongodb that has an orphaned user reference', function (done) {
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

          // Save a new Mongodb
          agent.post('/api/mongodbs')
            .send(mongodb)
            .expect(200)
            .end(function (mongodbSaveErr, mongodbSaveRes) {
              // Handle Mongodb save error
              if (mongodbSaveErr) {
                return done(mongodbSaveErr);
              }

              // Set assertions on new Mongodb
              (mongodbSaveRes.body.name).should.equal(mongodb.name);
              should.exist(mongodbSaveRes.body.user);
              should.equal(mongodbSaveRes.body.user._id, orphanId);

              // force the Mongodb to have an orphaned user reference
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

                    // Get the Mongodb
                    agent.get('/api/mongodbs/' + mongodbSaveRes.body._id)
                      .expect(200)
                      .end(function (mongodbInfoErr, mongodbInfoRes) {
                        // Handle Mongodb error
                        if (mongodbInfoErr) {
                          return done(mongodbInfoErr);
                        }

                        // Set assertions
                        (mongodbInfoRes.body._id).should.equal(mongodbSaveRes.body._id);
                        (mongodbInfoRes.body.name).should.equal(mongodb.name);
                        should.equal(mongodbInfoRes.body.user, undefined);

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
      Mongodb.remove().exec(done);
    });
  });
});
