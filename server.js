/**
 * Created by sdonose on 10/19/2015.
 */
var http = require("http");
var _ = require("underscore");
var bodyParser = require('body-parser');
var express = require("express");
var flash = require("connect-flash");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var stylus = require('stylus');
//var cors = require('cors');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var jwt = require('jwt-simple');
var passport = require('passport');
var localStrategy = require('./services/localStrategy.js');


var createSendToken = require('./services/jwt.js');



var app = express();

var server = require('http').createServer(app);
//var io = require('socket.io')(server);


var controllers = require("./controllers");
function compile(str, path) {
  return stylus(str).set('filename', path);
}

app.set("view engine", "jade");

//opt into services
app.use(function(req, res, next) {

  res.header('Access-Control-Allow-Credentials', 'true');

  res.header('Access-Control-Allow-Origin', '*');

  //res.header('Access-Control-Allow-Origin', 'http://localhost:9000');

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();

});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "chat"}));
app.use(flash());
//app.use(cors());

//app.use(stylus.middleware({
//  src: __dirname + "/public",
//  compile: compile
//
//}))
//set the public static resource folder
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());

passport.use('local-register', localStrategy.register);
passport.use('local-login', localStrategy.login);

app.post('/register', passport.authenticate('local-register'), function (req, res) {
  createSendToken(req.user, res);
});


app.post('/login', passport.authenticate('local-login'), function (req, res) {
  createSendToken(req.user, res);
});
//use authentication

//var auth = require('./auth');
//auth.init(app);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});


//routes
controllers.init(app);

//app.post('/register', function (req, res) {
//  //console.log(req.body);
//
//  var user = req.body;
//
//  var newUser = new User({
//    email: user.email,
//    password: user.password
//  })
//
//
//  newUser.save(function (err) {
//    createSendToken(newUser, res);
//  })
//})
//
//app.post('/login', function (req, res) {
//  req.user = req.body;
//
//  console.log(req.user);
//
//  var searchUser={
//    email:req.user.email
//  }
//
//  User.findOne(searchUser, function (err, user) {
//    if (err) throw err
//
//    if(!user)
//      return res.status(401).send({message:'wrong email or password'});
//
//    user.comparePasswords(req.user.password, function (err, isMatch) {
//      if (err) throw err
//
//      if (!isMatch)
//        return res.status(401).send({message:'wrong email or password'});
//
//      createSendToken(user, res);
//    });
//  })
//})
//
//function createSendToken(user, res) {
//
//  var payload = {
//    sub: user.id
//  }
//  var token = jwt.encode(payload, 'shhh....');
//
//  res.status(200).send({
//    user: user.toJSON(),
//    token: token
//  });
//}


mongoose.connect('mongodb://localhost/chatSocket')
server.listen(3000);
require('./updater/index.js').initialize(server);