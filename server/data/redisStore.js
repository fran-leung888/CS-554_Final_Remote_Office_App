const redisClient = require("../config/redisConfig");
const { ObjectId } = require("mongodb");

function getChatKey(chatId) {
  return "chat-" + chatId.toString();
}

function getMessagesKey(chatId) {
  return "chat-messages-" + chatId.toString();
}

function getUsersKey(userId) {
  return "user-" + userId.toString();
}

module.exports = {
  async storeUser(userId, user) {
    if (Array.isArray(userId)) {
      if (userId.length === 0) return true;
      let idStr = [];
      userId.forEach((id) => idStr.push(id.toString()));
      userId = idStr + "";
    } else {
      userId = userId.toString();
    }
    await redisClient.set(getUsersKey(userId), JSON.stringify(user));
    return true;
  },

  async getUser(userId) {
    const users = await redisClient.get(getChatKey(userId.toString()));
    return JSON.parse(users);
  },

  //   async storeMessage(chatId, messages) {
  //     if (Array.isArray(chatId)) {
  //       if (chatId.length === 0) return true;
  //       let idStr = [];
  //       chatId.forEach((id) => idStr.push(id.toString()));
  //       chatId = idStr + "";
  //     } else {
  //       chatId = chatId.toString();
  //     }
  //     await redisClient.set(getMessagesKey(chatId), JSON.stringify(messages));
  //     return true;
  //   },

  //   async getMessage(chatId) {
  //     if (Array.isArray(chatId)) {
  //       if (chatId.length === 0) return true;
  //       let idStr = [];
  //       chatId.forEach((id) => idStr.push(id.toString()));
  //       chatId = idStr + "";
  //     } else {
  //       chatId = chatId.toString();
  //     }
  //     const messages = await redisClient.get(getMessagesKey(chatId));
  //     return JSON.parse(messages);
  //   },

  async storeChat(userId, chats) {
    await redisClient.set(getChatKey(userId.toString()), JSON.stringify(chats));
    return true;
  },

  async getChat(userId) {
    const chats = await redisClient.get(getChatKey(userId.toString()));
    return JSON.parse(chats);
  },

  async removeChat(userId){
    return await redisClient.del(getChatKey(userId))
  }
};
