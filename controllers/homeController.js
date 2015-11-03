/**
 * Created by sdonose on 10/19/2015.
 */
(function(homeController){

  var data=require("../data");
  var auth=require("../auth")

  homeController.init=function(app){

    app.get("/", function (req, res) {
      //res.send("<html><body><h1>Express</h1></body></html>");
      //pt a vizualiza fol render

      data.getChatRoom(function(err,result){
        res.render("index", {
          title: "The chat",
          error:err,
          categories:result,
          newCatError:req.flash("newCatName"),
          user:req.user

        });
      });
      //change path for jade o engine

    });



    app.get("/notes/:categoryName",auth.ensureAuthenticated, function(req,res){
      var categoryName=req.params.categoryName;
      console.log(categoryName);
      res.render("notes",{title:categoryName,user:req.user});
    })



    app.post("/newCategory",function(req,res){

      var categoryName=req.body.categoryName;

      data.createNewRoom(categoryName,function(err){
        if(err){
          //handle error
          console.log(err);
          req.flash("newCatName",err);
          res.redirect("/")
        }else{
          res.redirect("/notes/"+categoryName);
        }
      })
    })
  }
})(module.exports);