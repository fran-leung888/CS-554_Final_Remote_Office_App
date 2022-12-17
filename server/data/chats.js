const mongoCollections = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const chatsCollection = mongoCollections.chats;
const usersCollection = mongoCollections.users;
const messagesCollection = mongoCollections.messages;
const { ObjectId } = require("mongodb");
const verification = require("../utils/verificationUtils");
const chatSocket = require("../socket/chatSocket");
const constant = require("./constant");

function constructMessage(chatId, userId, message, type = 0, enabled = false) {
  let result = {
    chatId,
    message,
    userId,
    // 0 - text
    type: 0,
    time: new Date().toJSON(),
    enabled,
  };
  console.log("construct Message ", result);
  return result;
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
  async addMessageById(chatId, userId, message, type = 0, notify = false) {
    console.log(
      `add Message by id ${chatId}, ${userId}, ${message}, ${type}, ${notify}`
    );
    verification.checkResult(verification.checkId(chatId));
    verification.checkResult(verification.verifyString(message));
    const chats = await chatsCollection();
    const messages = await messagesCollection();
    const chat = await chats.findOne({ _id: new ObjectId(chatId) });
    if (chat) {
      let mesageToInsert = constructMessage(chatId, userId, message);
      let result = await messages.insertOne(mesageToInsert);
      result = {
        ...result,
        ...mesageToInsert,
      };
      if (notify) {
        console.log('chatSocket is', chatSocket)
        chatSocket.notifyMessage(constant.event.message, chatId, {
          chatId,
          messageId: result.insertedId,
          message,
          userId,
          time: result.time,
        });
      }
      return result;
    } else {
      throw "Do not have this chat.";
    }
  },

  // add message and chat room
  // notify other user for the first message.
  async addMessage(from, to, message, type = 0) {
    console.log("add Message by two user");
    verification.checkResult(verification.checkId(from?._id));
    verification.checkResult(verification.checkId(to?._id));
    const users = await usersCollection();
    const chats = await chatsCollection();

    const fromUser = await users.find({ _id: new ObjectId(from._id) });
    const toUser = await users.find({ _id: new ObjectId(to._id) });
    if (fromUser && toUser) {
      const chat = await chats.find({ users: [from._id, to._id] });
      if ((await chat.count()) !== 0) {
        console.log("Add message to chat.");
        if (verification.checkResultQuiet(verification.verifyString(message))) {
          let result = await this.addMessageById(
            chat._id,
            from._id,
            message,
            chat.type,
            true
          );
          return result;
        }
      } else {
        // Add new chat if there is no related chat.
        // add message to chat
        console.log("add new chat");
        const newChat = await chats.insertOne(
          constructChat([from, to], type, true)
        );
        // notify new Chat
        chatSocket.notifyMessage(constant.event.newChat, to._id, {
          _id: newChat.insertedId,
          users: [from._id, to._id],
          type,
        });
        return newChat;
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

  async getChatsByUser(userId) {
    verification.checkResult(verification.checkId(userId));
    const users = await usersCollection();
    const chatCollection = await chatsCollection();
    const messageCollection = await messagesCollection();

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (user) {
      //   console.log({ users: userId });
      let cursor = await chatCollection.find({ users: userId });
      let chats = [],
        chatIds = [],
        messages = [];
      await cursor.forEach((chat) => {
        chats.push(chat);
        chatIds.push(chat._id.toString());
      });
      // find all messages
      cursor = await messageCollection.find({ chatId: { $in: chatIds } });
      await cursor.forEach((msg) => {
        messages.push(msg);
      });
      return { chats, messages };
    } else {
      throw "User does not exist.";
    }
  },

  async getChatById(chatId) {
    verification.checkResult(verification.checkId(chatId));
    const chatCollection = await chatsCollection();

    const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });
    if (chat) {
      //   console.log({ users: userId });
      return chat;
    } else {
      throw "Chat does not exist.";
    }
  },
};
