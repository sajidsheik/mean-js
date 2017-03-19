'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Express Schema
 */
var ExpressSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Express name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Express', ExpressSchema);
