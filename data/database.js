/**
 * Created by sdonose on 10/20/2015.
 */
//databse

(function (database) {

  var mongodb = require("mongodb");
  var mongoUrl = "mongodb://localhost:27017/chatSocket";
  var theDb = null;

  database.getDb = function (next) {
    if (!theDb) {
      //connect to the databse
      mongodb.MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
          next(err, null);
        } else {
          theDb = {
            db: db,
            chat: db.collection("chat")
            //users:db.collection("users")
          };
          next(null, theDb);
        }
      })
    } else {
      next(null, theDb);
    }
  }

})(module.exports);