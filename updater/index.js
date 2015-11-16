/**
 * Created by sdonose on 10/21/2015.
 */
var io = require('socket.io');
exports.initialize = function (server) {
  io = io.listen(server);

  io.sockets.on("connection",function(socket){

    //console.log("socket was connected");

    socket.on("join", function(nameRoom){
      socket.join(nameRoom);
    })
    socket.on("newMsg",function(data){
      socket.broadcast.to(data.nameRoom).emit("broadcast",data.msg,data.author);
      console.log(data.nameRoom,data.msg);
    })

  })
}