'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Express = mongoose.model('Express'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Express
 */
exports.create = function(req, res) {
  var express = new Express(req.body);
  express.user = req.user;

  express.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(express);
    }
  });
};

/**
 * Show the current Express
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var express = req.express ? req.express.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  express.isCurrentUserOwner = req.user && express.user && express.user._id.toString() === req.user._id.toString();

  res.jsonp(express);
};

/**
 * Update a Express
 */
exports.update = function(req, res) {
  var express = req.express;

  express = _.extend(express, req.body);

  express.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(express);
    }
  });
};

/**
 * Delete an Express
 */
exports.delete = function(req, res) {
  var express = req.express;

  express.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(express);
    }
  });
};

/**
 * List of Expresses
 */
exports.list = function(req, res) {
  Express.find().sort('-created').populate('user', 'displayName').exec(function(err, expresses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expresses);
    }
  });
};

/**
 * Express middleware
 */
exports.expressByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Express is invalid'
    });
  }

  Express.findById(id).populate('user', 'displayName').exec(function (err, express) {
    if (err) {
      return next(err);
    } else if (!express) {
      return res.status(404).send({
        message: 'No Express with that identifier has been found'
      });
    }
    req.express = express;
    next();
  });
};
