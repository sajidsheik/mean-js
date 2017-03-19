'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Angularj = mongoose.model('Angularj'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Angularj
 */
exports.create = function(req, res) {
  var angularj = new Angularj(req.body);
  angularj.user = req.user;

  angularj.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(angularj);
    }
  });
};

/**
 * Show the current Angularj
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var angularj = req.angularj ? req.angularj.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  angularj.isCurrentUserOwner = req.user && angularj.user && angularj.user._id.toString() === req.user._id.toString();

  res.jsonp(angularj);
};

/**
 * Update a Angularj
 */
exports.update = function(req, res) {
  var angularj = req.angularj;

  angularj = _.extend(angularj, req.body);

  angularj.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(angularj);
    }
  });
};

/**
 * Delete an Angularj
 */
exports.delete = function(req, res) {
  var angularj = req.angularj;

  angularj.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(angularj);
    }
  });
};

/**
 * List of Angularjs
 */
exports.list = function(req, res) {
  Angularj.find().sort('-created').populate('user', 'displayName').exec(function(err, angularjs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(angularjs);
    }
  });
};

/**
 * Angularj middleware
 */
exports.angularjByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Angularj is invalid'
    });
  }

  Angularj.findById(id).populate('user', 'displayName').exec(function (err, angularj) {
    if (err) {
      return next(err);
    } else if (!angularj) {
      return res.status(404).send({
        message: 'No Angularj with that identifier has been found'
      });
    }
    req.angularj = angularj;
    next();
  });
};
