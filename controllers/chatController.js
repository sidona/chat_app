// notesController.js
(function (chatController) {

  var data = require("../data");
  var auth = require("../auth");

  chatController.init  = function (app) {

    app.get("/api/chat",

      function (req, res) {

        var nameRoom = req.params.nameRoom;

        data.getRoom(nameRoom, function (err, results) {
          if (err) {
            res.send(400, err);
          } else {
            //res.set("Content-Type", "application/json");
            res.json(results);
          }
        });
      });
    app.post("/api/chat",

      function (req, res) {

        var nameRoom = req.params.nameRoom;
          console.dir(nameRoom)
        data.createNewRoom(nameRoom, function (err, results) {
          if (err) {
            res.send(400, err);
          } else {
            //res.set("Content-Type", "application/json");
            res.json(results);
          }
        });
      });


    app.get("/api/chat/:nameRoom",

      function (req, res) {

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

    app.post("/api/chat/:nameRoom",
      function (req, res) {

        var nameRoom = req.params.nameRoom;

        var msgToInsert = {
          msg: req.body.msg,
          author: req.user.username
        };

        data.addMsg(nameRoom, msgToInsert, function (err) {
          if (err) {
            res.send(400, "Failed to add note to data store");
          } else {
            res.set("Content-Type", "application/json");
            res.send(201, msgToInsert);
          }
        });

      });

  };

})(module.exports);