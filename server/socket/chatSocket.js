const { io, app, express, server } = require("../config/socket");

function getServerChatSocket(id) {
  return "server-chat-" + id;
}

function getClientChatSocket(id) {
  return "client-chat-" + id;
}

module.exports = {
  async notifyEvent(event, room, data) {
    if (room) {
      console.log("notify message to ", room);
      io.to(room).emit(event, data);
      console.log("Map<SocketId, Set<Room>> are ", io.of("/").adapter.sids);
    } else {
      throw "Chat invalid.";
    }
  },

  joinRoom(socket) {
    socket.on("joinRoom", (id) => {
      console.log(`socket ${socket.id} join room ${id}`);
      socket.join(id);
      // console.log("Map<SocketId, Set<Room>> are ", io.of("/").adapter.sids);

    });
  },
};
