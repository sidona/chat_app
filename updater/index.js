/**
 * Created by sdonose on 10/21/2015.
 */
(function(updater){
  var socketio = require("socket.io");


    updater.init=function(server){
      var io=socketio.listen(server);

      io.sockets.on("connection",function(socket){
      console.log("socket was connected");

      socket.on("join msg", function(msg){
        socket.join(msg);
        console.log(msg);
      })
      socket.on("newMsg",function(data){
        socket.broadcast.to(data.nameRoom).emit("broadcast",data.msg);

      })

      //socket.on('addMsg',function(msg){
      //  io.emit('message',{
      //    msg:'new message',
      //    msg:msg
      //  })
      //})
    })
  }
})(module.exports)