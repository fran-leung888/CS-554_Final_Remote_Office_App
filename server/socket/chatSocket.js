const { Server } = require("socket.io");
const io = new Server(server);
const chatData = require("../data/chats");
const constant = require("../data/constant");
function getServerChatSocket(id) {
  return "server-chat-" + id;
}

function getClientChatSocket(id) {
  return "client-chat-" + id;
}

async function listenAfterLogin(user) {
  if (user?._id) {
    const chats = await chatData.getChats(user._id);
    chats.forEach((chat) => {
      io.on(getServerChatSocket(chat._id), async (data, callback) => {
        if (data?.type) {
          try {
            let newMessage = await chatData.addMessage(data.user, data.message);
            io.emit(getClientChatSocket(chat._id), {
              message: newMessage,
            });
            callback({
              status: constant.socketRes.success,
            });
          } catch (e) {
            callback({
              status: constant.socketRes.fail,
            });
          }
        } else {
          callback({
            status: constant.socketRes.fail,
          });
        }
      });
    });
  } else {
    throw "User invalid.";
  }
}
