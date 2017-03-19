'use strict';

/**
 * Module dependencies
 */
var mongodbsPolicy = require('../policies/mongodbs.server.policy'),
  mongodbs = require('../controllers/mongodbs.server.controller');

module.exports = function(app) {
  // Mongodbs Routes
  app.route('/api/mongodbs').all(mongodbsPolicy.isAllowed)
    .get(mongodbs.list)
    .post(mongodbs.create);

  app.route('/api/mongodbs/:mongodbId').all(mongodbsPolicy.isAllowed)
    .get(mongodbs.read)
    .put(mongodbs.update)
    .delete(mongodbs.delete);

  // Finish by binding the Mongodb middleware
  app.param('mongodbId', mongodbs.mongodbByID);
};
