/**
 * Created by sdonose on 11/11/2015.
 */

'use strict'

var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({

  content: String

  //post:{type:mongoose.Schema.Types.ObjectId, ref:'Post'}
})

var PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  created_at: {type: Date},
  author : String,
  // user: {type: String, required:true},
  comments: [{
    content: String
  }]
})

PostSchema.pre('save', function (next) {
  var now = new Date();
  var self = this;
  this.created_at = now;

  next();
})


mongoose.model('Post', PostSchema)