/**
 * Created by sdonose on 11/11/2015.
 */

  'use strict'

var mongoose=require('mongoose');

var PostSchema=new mongoose.Schema({
  title:String,
  content:String,
  created_at: { type: Date },
  user: {type: String, required:true},
})
PostSchema.pre('save',function(next){
  var now=new Date();
  this.created_at=now;

  next();
})
mongoose.model('Post',PostSchema)