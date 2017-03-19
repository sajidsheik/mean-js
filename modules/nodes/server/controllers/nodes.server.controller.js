'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Node = mongoose.model('Node'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Node
 */
exports.create = function(req, res) {
  var node = new Node(req.body);
  node.user = req.user;

  node.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(node);
    }
  });
};

/**
 * Show the current Node
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var node = req.node ? req.node.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  node.isCurrentUserOwner = req.user && node.user && node.user._id.toString() === req.user._id.toString();

  res.jsonp(node);
};

/**
 * Update a Node
 */
exports.update = function(req, res) {
  var node = req.node;

  node = _.extend(node, req.body);

  node.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(node);
    }
  });
};

/**
 * Delete an Node
 */
exports.delete = function(req, res) {
  var node = req.node;

  node.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(node);
    }
  });
};

/**
 * List of Nodes
 */
exports.list = function(req, res) {
  Node.find().sort('-created').populate('user', 'displayName').exec(function(err, nodes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(nodes);
    }
  });
};

/**
 * Node middleware
 */
exports.nodeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Node is invalid'
    });
  }

  Node.findById(id).populate('user', 'displayName').exec(function (err, node) {
    if (err) {
      return next(err);
    } else if (!node) {
      return res.status(404).send({
        message: 'No Node with that identifier has been found'
      });
    }
    req.node = node;
    next();
  });
};
