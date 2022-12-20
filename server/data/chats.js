const mongoCollections = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const chatsCollection = mongoCollections.chats;
const usersCollection = mongoCollections.users;
const messagesCollection = mongoCollections.messages;
const burnedCollection = mongoCollections.burned;
const { ObjectId } = require("mongodb");
const verification = require("../utils/verificationUtils");
const chatSocket = require("../socket/chatSocket");
const constant = require("./constant");
const redisStore = require("./redisStore");

function constructMessage(chatId, userId, message, type = 0, enabled = false) {
  let result = {
    chatId,
    message,
    userId,
    // 0 - text
    type,
    time: new Date().toLocaleString(),
    enabled,
  };
  console.log("construct Message ", result);
  return result;
}

function constructChat(
  users,
  type = constant.chatType.individual,
  groupId,
  groupName
) {
  return {
    users,
    type,
    groupId,
    groupName,
  };
}

function conBurnningRecord(userId, messageId) {
  return {
    userId,
    messageId,
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
      let mesageToInsert = constructMessage(chatId, userId, message, type);
      let result = await messages.insertOne(mesageToInsert);
      result = {
        ...result,
        ...mesageToInsert,
      };
      if (notify) {
        chatSocket.notifyEvent(constant.event.message, chatId, {
          chatId,
          messageId: result.insertedId,
          message,
          userId,
          time: result.time,
          type,
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
            type,
            true
          );
          return result;
        }
      } else {
        // Add new chat if there is no related chat.
        // add message to chat
        console.log("add new chat");
        const newChat = await chats.insertOne(
          constructChat(
            [from._id.toString(), to._id.toString()],
            constant.chatType.individual
          )
        );
        // notify new Chat
        await redisStore.removeUserChat(from._id);
        chatSocket.notifyEvent(constant.event.newChat, to._id, {
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
    // get message from redis
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
    // check redis cache
    let chats = await redisStore.getUserChat(userId);
    const users = await usersCollection();
    const chatCollection = await chatsCollection();
    const messageCollection = await messagesCollection();

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (user) {
      let cursor,
        chatIds = [],
        messages = [];
      if (!chats) {
        chats = [];
        //   console.log({ users: userId });
        cursor = await chatCollection.find({ users: { $in: [userId] } });
        await cursor.forEach((chat) => {
          chats.push(chat);
          chatIds.push(chat._id.toString());
        });
        await redisStore.storeUserChat(userId, chats);
      } else {
        chats.forEach((chat) => chatIds.push(chat._id.toString()));
      }
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

  async getChatByGroupId(groupId) {
    console.log("Get group chat by group Id", groupId);
    verification.checkResult(verification.checkId(groupId));
    const chatCollection = await chatsCollection();

    const chat = await chatCollection.findOne({
      groupId,
      type: constant.chatType.group,
    });
    if (chat) {
      //   console.log({ users: userId });
      return chat;
    } else {
      throw "Chat does not exist.";
    }
  },

  async addUserInGroupChat(groupId, userId) {
    console.log("add User to group chat by group id", groupId);
    verification.checkResult(verification.checkId(groupId));
    const chatCollection = await chatsCollection();

    const chat = await chatCollection.update(
      {
        groupId,
      },
      { $push: { users: userId } }
    );
    if (chat) {
      //   console.log({ users: userId });
      return chat;
    } else {
      throw "Chat does not exist.";
    }
  },

  async addGroupChat(userId, groupId, groupName) {
    console.log("Add group chat, ", userId, groupId);
    const chatCollection = await chatsCollection();
    const newChat = await chatCollection.insertOne(
      constructChat([userId], constant.chatType.group, groupId, groupName)
    );
    return newChat;
  },

  async addBurnRecord(userId, messageId) {
    const readed = await burnedCollection();
    const newChat = await readed.insertOne(
      conBurnningRecord(userId, messageId)
    );
    return { newChat, userId, messageId };
  },

  async getBurn(userId) {
    const burned = await burnedCollection();
    const cursor = await burned.find({ userId });
    let burnedMsgs = [];
    await cursor.forEach((msg) => {
      burnedMsgs.push(msg);
    });
    return burnedMsgs;
  },
};
