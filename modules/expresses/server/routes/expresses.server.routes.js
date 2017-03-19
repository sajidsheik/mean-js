'use strict';

/**
 * Module dependencies
 */
var expressesPolicy = require('../policies/expresses.server.policy'),
  expresses = require('../controllers/expresses.server.controller');

module.exports = function(app) {
  // Expresses Routes
  app.route('/api/expresses').all(expressesPolicy.isAllowed)
    .get(expresses.list)
    .post(expresses.create);

  app.route('/api/expresses/:expressId').all(expressesPolicy.isAllowed)
    .get(expresses.read)
    .put(expresses.update)
    .delete(expresses.delete);

  // Finish by binding the Express middleware
  app.param('expressId', expresses.expressByID);
};
