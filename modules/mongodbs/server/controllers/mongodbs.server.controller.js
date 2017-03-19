'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mongodb = mongoose.model('Mongodb'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Mongodb
 */
exports.create = function(req, res) {
  var mongodb = new Mongodb(req.body);
  mongodb.user = req.user;
  console.log(req);
  mongodb.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mongodb);
    }
  });
};

/**
 * Show the current Mongodb
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mongodb = req.mongodb ? req.mongodb.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mongodb.isCurrentUserOwner = req.user && mongodb.user && mongodb.user._id.toString() === req.user._id.toString();

  res.jsonp(mongodb);
};

/**
 * Update a Mongodb
 */
exports.update = function(req, res) {
  var mongodb = req.mongodb;

  mongodb = _.extend(mongodb, req.body);

  mongodb.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mongodb);
    }
  });
};

/**
 * Delete an Mongodb
 */
exports.delete = function(req, res) {
  var mongodb = req.mongodb;

  mongodb.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mongodb);
    }
  });
};

/**
 * List of Mongodbs
 */
exports.list = function(req, res) {
  Mongodb.find().sort('-created').populate('user', 'displayName').exec(function(err, mongodbs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mongodbs);
    }
  });
};

/**
 * Mongodb middleware
 */
exports.mongodbByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mongodb is invalid'
    });
  }

  Mongodb.findById(id).populate('user', 'displayName').exec(function (err, mongodb) {
    if (err) {
      return next(err);
    } else if (!mongodb) {
      return res.status(404).send({
        message: 'No Mongodb with that identifier has been found'
      });
    }
    req.mongodb = mongodb;
    next();
  });
};
