// notesController.js
(function (chatController) {

  var data = require("../data");
  var jwt = require('jwt-simple');
  //var User = require("../models/User.js");
  //var auth = require("../services/localStrategy");


  chatController.init = function (app) {



    app.get("/api/chat", function (req, res) {

      //var token=req.headers.authorization.split(' ')[1];
      //var payload =jwt.decode(token,"shhh..")
      //if (!payload.sub)
      //  res.status(401).send({
      //    message: 'Authentication failed'
      //  });
      //
      //if (!req.headers.authorization) {
      //  return res.status(401).send({
      //    message: 'You are not authorized'
      //  });
      //}

      var nameRoom = req.params.nameRoom;
      data.getRoom(nameRoom, function (err, results) {
        if (err) {
          res.send(400, err);
        } else {
          res.json(results);
        }


      });
    });

    app.post("/api/chat", function (req, res) {
      var room = {
        nameRoom: req.body.nameRoom,
        chat: []
      };
      data.createNewRoom(room, function (err, results) {
        if (err) {
          res.send(400, err);
        } else {
          //res.set("Content-Type", "application/json");
          res.send(
            (err === null) ? {msg: ''} : {msg: 'Error updating movie: ' + err}
          )

        }
      });
    });

    app.get("/api/chat/:nameRoom", function (req, res) {
      var nameRoom = req.params.nameRoom;
      data.getMsg(nameRoom, function (err, results) {
        if (err) {
          res.send(400, err);
        } else {
          res.set("Content-Type", "application/json");
          //res.send(chat.chat);
          res.json(results)
        }
      });
    });

    app.post("/api/chat/:nameRoom", function (req, res) {
      var nameRoom = req.params.nameRoom;
      var msgToInsert = {
        msg: req.body.msg
        //author: req.searchUser.email
      };

      data.addMsg(nameRoom, msgToInsert, function (err,results) {
        if (err) {
          res.send(400, "Failed to add chat to data store");
        } else {
          res.set("Content-Type", "application/json");
          res.send(201, msgToInsert);
         // res.json(results)
        }
      });
    });
  };

})(module.exports);