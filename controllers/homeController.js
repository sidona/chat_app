/**
 * Created by sdonose on 10/19/2015.
 */
(function (homeController) {

  var data = require("../data");
 // var auth = require("../auth")

  homeController.init = function (app) {

    app.get("/", function (req, res) {
      data.getChatRoom(function (err, result) {
        res.render("index", {
          title: "The chat",
          error: err,
          categories: result,
          newCatError: req.flash("newCatName"),
          user: req.user
        });
      });
    });


    app.get("/chat/:nameRoom",
      //auth.ensureAuthenticated,
      function (req, res) {
      var nameRoom = req.params.nameRoom;
      console.log(nameRoom);
      res.render("chat", {title: nameRoom, user: req.user});
    })


    app.post("/newCategory", function (req, res) {

      var nameRoom = req.body.nameRoom;

      data.createNewRoom(nameRoom, function (err) {
        if (err) {
          //handle error
          console.log(err);
          req.flash("newCatName", err);
          res.redirect("/")
        } else {
          res.redirect("/chat/" + nameRoom);
        }
      })
    })
  }
})(module.exports);