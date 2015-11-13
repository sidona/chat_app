/**
 * Created by sdonose on 11/11/2015.
 */
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Post = mongoose.model('Post');
//var Comment=mongoose.model('Comment');
var User = mongoose.model('User');
//var expressJwt=require('express-jwt');

//var secret="shhh..";
//var payload = jwt.decode(token, "shhh..")

//var auth = expressJwt({secret: secret, userProperty: 'payload'});
//var createSendToken = require('../services/jwt.js');

router.param('postId', function (req, res, next, postId) {
  Post.findById(postId, function (err, post) {
    console.log('THE POST ID IS: ', postId);
    if (err) return res.sendStatus(404)
    req.post = post;
    next();
  });
});


router.get('/post', function (req, res) {
  Post.find(function (err, posts) {
    res.json(posts);
  });
});

router.get('/post/:id',function(req,res){
  Post.findOne({'_id':Object(req.params.id)},function(err,results){
    res.json(results);
  })
})

router.post('/post/:id/comments', function (req, res, next) {
  // var comment = new Comment(req.body);
  var post = new Post(req.body);
  var commentsArr = [];

  commentsArr.push(req.body);

  Post.findOne({'_id': Object(req.params.id)}, function (err, results) {
    results.comments.push(req.body);
    results.save(function (err) {
      if (err) return handleError(err);
      res.send(results)
    })
  });
});

router.post('/post', function (req, res) {
  var post = new Post(req.body);
  //post.author = createSendToken(req.payload.user);
  post.save(function (err) {
    res.json(post);
  });
});

router.delete('/post/:id', function (req, res) {
  Post.remove({'_id': Object(req.params.id)}, function (err) {
    res.send(
      (err === null) ? {msg: ''} : {msg: 'error delete post' + err}
    )
  });
});

module.exports = router;