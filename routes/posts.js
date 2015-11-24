/**
 * Created by sdonose on 11/11/2015.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var multer = require('multer');
var _ = require("underscore");
var util = require("util");
var fs = require("fs");
var jwt = require('jsonwebtoken');
var config = require('../services/config');

var uploading = multer();

router.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.SECRET, function (err, decoded) {
      if (err) {
        return res.json({success: false, message: 'Failed to authenticate token.'});
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

router.param('postId', function (req, res, next, postId) {
  Post.findById(postId, function (err, post) {
    console.log('THE POST ID IS: ', postId);
    if (err) return res.sendStatus(404);
    req.post = post;
    next();
  });
});

router.get('/profile/:id', function (req, res) {
  User.findById({'_id': Object(req.params.id)}, function (err, results) {
    res.json(results);
  })
});

router.post("/upload", function (req, res, next) {
  if (req.files) {
    console.log(util.inspect(req.files));
    if (req.files.myFile.size === 0) {
      return next(new Error("Hey, first would you select a file?"));
    }
    fs.exists(req.files.myFile.path, function (exists) {
      if (exists) {
        res.end("Got your file!");
      } else {
        res.end("Well, there is no magic for those who don’t believe in it!");
      }
    });
  }
});

router.put('/profile/:id', uploading.array(), function (req, res) {
  var user = new User(req.body);
  var profile = req.body;
  User.findByIdAndUpdate({'_id': Object(req.params.id)}, {$set: {profile: req.body}},
    function (err, result) {
      res.send(
        (err === null) ? {msg: ''} : {msg: 'Error updating movie: ' + err}
      )
    })
});

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