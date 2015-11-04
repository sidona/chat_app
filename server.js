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

/*app.get("/api/sql", function (req, res) {
  var msnodesql = require("msnodesql");
  var connString = "Driver={SQL Server Native Client 10.0};Server=.\\sqlexpress12;Database=Northwind;Trusted_Connection={Yes}";

  msnodesql.query(connString, "SELECT * FROM Customers WHERE CustomerID = 'ALFKI'", function (err, results) {
    // Error Handling
    res.send(results);
  });
});
*/
var server = http.createServer(app);

server.listen(3000);

var updater=require("./updater");
updater.init(server);