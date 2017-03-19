'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mongodb Schema
 */
var MongodbSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Mongodb name',
    trim: true
  },
  Description:{
      type:String,
      default: '',
      required: 'Please fill Mongodb description',
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

mongoose.model('Mongodb', MongodbSchema);
