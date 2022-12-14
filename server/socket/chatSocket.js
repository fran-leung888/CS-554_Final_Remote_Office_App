const chatData = require("../data/chats");
const constant = require("../data/constant");
const {io, app, express, server} = require('../config/socket')

function getServerChatSocket(id) {
  return "server-chat-" + id;
}

function getClientChatSocket(id) {
  return "client-chat-" + id;
}

const messageEvent = "message";

module.exports = {
  // async listenAfterLogin(user) {
  //   if (user?._id) {
  //     const chats = await chatData.getChatsByUser(user._id);
  //     chats.forEach((chat) => {
  //       io.on(getServerChatSocket(chat._id), async (data, callback) => {
  //         if (data?.type) {
  //           try {
  //             let newMessage = await chatData.addMessage(
  //               data.user,
  //               data.message
  //             );
  //             io.emit(getClientChatSocket(chat._id), {
  //               message: newMessage,
  //             });
  //             callback({
  //               status: constant.socketRes.success,
  //             });
  //           } catch (e) {
  //             callback({
  //               status: constant.socketRes.fail,
  //             });
  //           }
  //         } else {
  //           callback({
  //             status: constant.socketRes.fail,
  //           });
  //         }
  //       });
  //     });
  //   } else {
  //     throw "User invalid.";
  //   }
  // },

  async notifyMessage(chatId, messageId, message, user, time) {
    if (chatId) {
      console.log('notify message to ', chatId)
      io.to(chatId).emit(messageEvent, {
        messageId,
        message,
        user,
        time,
      });
    } else {
      throw "Chat invalid.";
    }
  },

  joinRoom(socket) {
    socket.on("joinRoom", (chatId) => {
      console.log(`socket ${socket.id} join room ${chatId}`);
      socket.join(chatId);
    });
  },
};
