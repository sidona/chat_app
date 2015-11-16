/**
 * Created by sdonose on 11/11/2015.
 */

'use strict';

var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
  content: String,
  author: String,
  created_at: {type: Date}
});

var PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  created_at: {type: Date},
  author: String,
  comments: [CommentSchema]
});

mongoose.model('Post', PostSchema);