/**
 * Created by sdonose on 11/11/2015.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');


router.param('postId', function (req, res, next, postId) {
  Post.findById(postId, function (err, post) {
    console.log('THE POST ID IS: ', postId);
    if (err) return res.sendStatus(404);
    req.post = post;
    next();
  });
});

router.get('/profile/:id', function (req, res) {
  User.findOne({'_id': Object(req.params.id)}, function (err, results) {
    res.json(results);
  })
});


router.put('/profile/:id',function(req,res){
  var user=new User(req.body);
  var profile=req.body;
  User.findByIdAndUpdate({'_id':Object(req.params.id)},{$set: {profile:req.body}},
    function (err, result) {
      res.send(
        (err === null) ? {msg: ''} : {msg: 'Error updating movie: ' + err}
      )
    })

})

router.get('/users', function (req, res) {
  User.find(function (err, users) {
    res.json(users);
  });
});

router.get('/post', function (req, res) {

  Post.find(function (err, posts) {
    res.json(posts);
  });
});

router.get('/post/:id', function (req, res) {
  Post.findOne({'_id': Object(req.params.id)}, function (err, results) {
    res.json(results);
  })
});

router.post('/post/:id', function (req, res, next) {
  var post = new Post(req.body);
  var commentsArr = [];
  commentsArr.push(req.body);

  Post.findOne({'_id': Object(req.params.id)}, function (err, results) {
    req.body.created_at = Date.now();
    results.comments.push(req.body);
    results.save(function (err) {
      if (err) return handleError(err);
      res.send(results)
    })
  });
});

router.post('/post', function (req, res) {
  var post = new Post(req.body);
  post.created_at = Date.now();
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