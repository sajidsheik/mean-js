'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Mongodbs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/mongodbs',
      permissions: '*'
    }, {
      resources: '/api/mongodbs/:mongodbId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/mongodbs',
      permissions: ['get', 'post']
    }, {
      resources: '/api/mongodbs/:mongodbId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/mongodbs',
      permissions: ['get']
    }, {
      resources: '/api/mongodbs/:mongodbId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Mongodbs Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Mongodb is being processed and the current user created it then allow any manipulation
  if (req.mongodb && req.user && req.mongodb.user && req.mongodb.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
