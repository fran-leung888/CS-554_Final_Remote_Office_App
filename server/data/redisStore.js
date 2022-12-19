const redisClient = require("../config/redisConfig");
const { ObjectId } = require("mongodb");

function getUserChatKey(chatId) {
  return "chat-" + chatId.toString();
}

function getMessagesKey(chatId) {
  return "chat-messages-" + chatId.toString();
}

function getUsersKey(userId) {
  return "user-" + userId.toString();
}

function convertUserIds(userIds) {
  if (Array.isArray(userIds)) {
    if (userIds.length === 0) return true;
    let idStr = [];
    userIds.forEach((id) => idStr.push(id.toString()));
    userIds = idStr + ",";
  } else {
    userIds = userIds.toString();
  }
  return userIds;
}

module.exports = {
  async storeUser(userId, user) {
    userId = convertUserIds(userId);
    await redisClient.set(getUsersKey(userId), JSON.stringify(user));
    return true;
  },

  async getUser(userId) {
    userId = convertUserIds(userId);

    const users = await redisClient.get(getUsersKey(userId.toString()));
    return JSON.parse(users);
  },

  async removeUser(userId) {
    userId = convertUserIds(userId);

    await redisClient.del(getUsersKey(userId.toString()));
    return true;
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

  async storeUserChat(userId, chats) {
    await redisClient.set(
      getUserChatKey(userId.toString()),
      JSON.stringify(chats)
    );
    return true;
  },

  async getUserChat(userId) {
    const chats = await redisClient.get(getUserChatKey(userId.toString()));
    return JSON.parse(chats);
  },

  async removeUserChat(userId) {
    return await redisClient.del(getUserChatKey(userId));
  },
};
