'use strict';

/**
 * Module dependencies
 */
var angularjsPolicy = require('../policies/angularjs.server.policy'),
  angularjs = require('../controllers/angularjs.server.controller');

module.exports = function(app) {
  // Angularjs Routes
  app.route('/api/angularjs').all(angularjsPolicy.isAllowed)
    .get(angularjs.list)
    .post(angularjs.create);

  app.route('/api/angularjs/:angularjId').all(angularjsPolicy.isAllowed)
    .get(angularjs.read)
    .put(angularjs.update)
    .delete(angularjs.delete);

  // Finish by binding the Angularj middleware
  app.param('angularjId', angularjs.angularjByID);
};
