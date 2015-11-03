/**
 * Created by sdonose on 10/19/2015.
 */
(function(controllers){
  var homeController=require("./homeController");
  var chatController=require("./chatController");

controllers.init=function(app){
  homeController.init(app);
  chatController.init(app);
};

})(module.exports);