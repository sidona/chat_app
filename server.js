/**
 * Created by sdonose on 10/19/2015.
 */
var http = require("http");
var _ = require("underscore");
var bodyParser = require('body-parser');
var express = require("express");
var flash=require("connect-flash");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var stylus=require('stylus');
var cors = require('cors');
var app = express();

var controllers=require("./controllers");
//var ejsEngine=require("ejs-locals");
function compile(str,path){
  return stylus(str).set('filename',path);
}

app.set("view engine", "jade");
//app.engine("ejs",ejsEngine);//suport master pages
//app.set("view engine","ejs");//ejs view engine
//app.set("view engine","vash");

//opt into services
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret:"PluralsightTheBoard"}));
app.use(flash());
app.use(cors());

app.use(stylus.middleware({
  src:__dirname + "/public",
  compile:compile

}))
//set the public static resource folder
app.use(express.static(__dirname + "/public"));

//use authentication

var auth=require('./auth');
auth.init(app);


//routes
controllers.init(app);

app.get("/api/users", function (req, res) {
  res.set("Content-Type", "application/json");
  res.send({
    name: "sidona",
    isValid: "true",
    group: "Admin"
  });
});

var server = http.createServer(app);

server.listen(3000);

var updater=require("./updater");
updater.init(server);