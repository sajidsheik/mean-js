'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Angularj Schema
 */
var AngularjSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Angularj name',
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

mongoose.model('Angularj', AngularjSchema);
