import axios from "../config/axios";
import constant from "./constant";

async function addIndividualChat(from, to, message) {
  let response = await axios.post("/chat", {
    from,
    to,
    message,
    type: constant.chatType.individual,
  });
  return response;
}

async function getChats(id) {
  let response = await axios.get("/chat?id=" + id);
  return response;
}

async function sendMessage(chatId, message, user, type = 0) {
  let response = await axios.post("/chat", {
    id: chatId,
    message,
    user,
    type,
  });
  return response;
}

async function getMessages(chatId) {
  let response = await axios.get("/chat/messages?id=" + chatId);
  return response;
}

async function getBurnedMsgs(userId) {
  let response = await axios.get("/chat/message/burn?userId=" + userId);
  return response;
}

async function burnMessage(userId, messageId) {
  let response = await axios.post(
    `/chat/message/burn?userId=${userId}&messageId=${messageId}`
  );
  return response;
}

function getServerChatSocket(id) {
  return "server-chat-" + id;
}

function getClientChatSocket(id) {
  return "client-chat-" + id;
}

export default {
  addIndividualChat,
  sendMessage,
  getChats,
  getMessages,
  burnMessage,
  getBurnedMsgs
};
