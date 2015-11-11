/**
 * Created by sdonose on 11/11/2015.
 */
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Post = mongoose.model('Post');

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

router.post('/post', function (req, res) {
  var post = new Post(req.body);
  post.save(function (err) {
    res.json(post);
  });
});

router.delete('/post/:id', function (req, res) {
  Post.remove({'_id':Object(req.params.id)}, function (err) {
   res.send(
     (err===null)?{msg:''}:{msg:'error delete post'+err}
   )
  });
});

module.exports = router;