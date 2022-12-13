const mongoCollections = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const chatsCollection = mongoCollections.chats;
const usersCollection = mongoCollections.users;
const messagesCollection = mongoCollections.messages;
const { ObjectId } = require("mongodb");
const verification = require("../utils/verificationUtils");

function constructMessage(chatId, message, type = 0) {
  return {
    chatId,
    message,
    // 0 - enabled, 1 - disabled
    type: 0,
  };
}

function constructChat(users, type = 0) {
  let userIds = [];
  if (users) {
    users.forEach((user) => {
      userIds.push(user._id);
    });
  }
  return {
    users: userIds,
    type,
  };
}

module.exports = {
  async addMessageById(chatId, message, type = 0) {
    verification.checkResult(verification.checkId(chatId));
    verification.checkResult(verification.verifyString(message));
    const chats = await chatsCollection();
    const messages = await messagesCollection();
    const chat = await chats.findOne({ _id: new ObjectId(chatId) });
    if (chat) {
      if (verification.verifyString(message).valid) {
        return await messages.insert(constructMessage(chatId, message));
      }
    } else {
      throw "Do not have this chat.";
    }
  },

  async addMessage(from, to, message, type = 0) {
    verification.checkResult(verification.checkId(from?._id));
    verification.checkResult(verification.checkId(to?._id));
    const users = await usersCollection();
    const chats = await chatsCollection();

    const fromUser = await users.find({ _id: new ObjectId(from._id) });
    const toUser = await users.find({ _id: new ObjectId(to._id) });
    if (fromUser && toUser) {
      const chat = await chats.find({ users: [from._id, to._id] });
      if ((await chat.count()) !== 0) {
        console.log("add message");
        if (verification.checkResultQuiet(verification.verifyString(message))) {
          addMessageById(chat._id, message);
        }
      } else {
        // Add new chat if there is no related chat.
        // add message to chat
        console.log("add new chat");
        const newChat = await chats.insertOne(constructChat([from, to], type));
        addMessageById(newChat._id, message);
      }
    } else {
      throw "User does not exist.";
    }
  },

  
  async getMessages(chatId) {
    verification.checkResult(verification.checkId(chatId));
    const chatCollection = await chatsCollection();
    const messageCollection = await messagesCollection();

    const chat = await chatCollection.findOne({ _id: ObjectId(chatId) });
    if (chat) {
      const cursor = await messageCollection.find({ chatId: chatId });
      let messages = [];
      await cursor.forEach((chat) => {
        messages.push(chat);
      });
      return messages ? messages : [];
    } else {
      throw "Chat does not exist.";
    }
  },

  async getChats(userId) {
    verification.checkResult(verification.checkId(userId));
    const users = await usersCollection();
    const chatCollection = await chatsCollection();

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (user) {
      //   console.log({ users: userId });
      const cursor = await chatCollection.find({ users: userId });
      let chats = [];
      await cursor.forEach((chat) => {
        chats.push(chat);
      });
      return chats ? chats : [];
    } else {
      throw "User does not exist.";
    }
  },
};
