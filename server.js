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
var mongoose = require('mongoose');
var User = require('./models/User.js');
var jwt = require('jwt-simple');
var cors=require('cors');
var passport = require('passport');
var localStrategy = require('./services/localStrategy.js');
var emailVerification = require('./services/emailVerification.js');


var createSendToken = require('./services/jwt.js');



var app = express();

require('./models/Post.js');

var server = require('http').createServer(app);

var posts = require('./routes/posts');


var controllers = require("./controllers");
function compile(str, path) {
  return stylus(str).set('filename', path);
}

//middleware
app.set("view engine", "jade");

//opt into services
app.use(cors());
app.use(function(req, res, next) {

  res.header('Access-Control-Allow-Credentials', 'true');

  res.header('Access-Control-Allow-Origin', '*');

  //res.header('Access-Control-Allow-Origin', 'http://localhost:9000');

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,x-access-token');

  next();

});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "chat"}));
app.use(flash());
//app.use(cors());

app.use('/', posts);

//set the public static resource folder
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());


passport.use('local-register', localStrategy.register);
passport.use('local-login', localStrategy.login);

app.post('/register', passport.authenticate('local-register'), function (req, res) {
  emailVerification.send(req.user.email);
  createSendToken(req.user, res);
});

app.post('/login', passport.authenticate('local-login'), function (req, res) {
  createSendToken(req.user, res);

  console.log('req.user',req.user)

});





app.get('/verifyEmail', emailVerification.handler);
//use authentication

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//passport.deserializeUser(function(id, done) {
//  User.findById(id, function(err, user) {
//    done(err, user);
//  });
//});

//routes
controllers.init(app);



mongoose.connect('mongodb://localhost/chatSocket')
server.listen(3000);
require('./updater/index.js').initialize(server);