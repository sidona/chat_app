/**
 * Created by sdonose on 10/19/2015.
 */
(function (data) {
  var seedData = require("./seedData");
  var database = require("./database");

  data.getRoom = function (nameRoom, next) {
    database.getDb(function (err, db) {
      if (err) {
        next(err);
      } else {
        db.chat.find().toArray(function (err, results) {
          if (err) {
            next(err, null)
          } else {
            next(null, results);
          }
        });
      }
    })
  };

  data.getChatRoom = function (next) {
    database.getDb(function (err, db) {
      if (err) {
        next(err, null);
      } else {
        db.chat.find().sort({nameRoom: 1}).toArray(function (err, results) {
          if (err) {
            next(err, null)
          } else {
            next(null, results);
          }
        });
      }
    });
  };

  data.getMsg = function (nameRoom, next) {
    database.getDb(function (err, db) {
      if (err) {
        next(err);
      } else {
        db.chat.findOne({nameRoom: nameRoom}, next);
      }
    })
  };

  data.addMsg = function (nameRoom, msgToInsert, next) {
    database.getDb(function (err, db) {
      if (err) {
        next(err)
      } else {
        db.chat.update({nameRoom: nameRoom}, {$push: {chat: msgToInsert}}, next);
      }
    })
  };

  data.createNewRoom = function (room, next) {
    //console.dir(nameRoom);
    database.getDb(function (err, db) {
      if (err) {
        next(err, null);
      } else {
        //verify if categories exist
        db.chat.find({nameRoom: room.nameRoom}).count(function (err, count) {
          if (err) {
            next(err,null);
          } else {
            if (count!=0) {
              next("category exist",null)
            }else{
              db.chat.insert(room, function (err) {
                if (err) {
                  next(err)
                } else {
                  next(null)
                }
              });
            }
          }
        });
      }
    });
  };


  data.addUser = function (user, next) {
    database.getDb(function (err, db) {
      if (err) {
        console.log("failed to seed database " + err);
      }
      else {
        db.users.insert(user, next);
      }
    })

  };

  data.getUser = function (username, next) {
    database.getDb(function (err, db) {
      if (err) {
        next(err)
      }
      else {
        db.users.findOne({username: username}, next)
      }
    })
  };
  //function seedDatabase() {
  //  database.getDb(function (err, db) {
  //    if (err) {
  //      console.log("failed to seed database " + err);
  //    }
  //    else {
  //      //inseram ce avem in seeddata
  //      //test to see if data exist
  //      db.chat.count(function (err, count) {
  //        if (err) {
  //          console.log("failed to retrieve database count")
  //        }
  //        else {
  //          if (count == 0) {
  //            console.log("seeding database");
  //            seedData.initialChat.forEach(function (item) {
  //              db.chat.insert(item, function (err) {
  //                if (err) console.log("failed to insert chat")
  //              })
  //            })
  //          }
  //          else {
  //            console.log("database already seedData")
  //          }
  //        }
  //      })
  //
  //
  //    }
  //  })
  //}
  //
  //seedDatabase();
})
(module.exports);