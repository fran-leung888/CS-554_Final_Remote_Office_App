import { createSlice } from "@reduxjs/toolkit";

function constructMessage(
  id,
  message,
  user,
  time,
  type,
  loading = false,
  fail = false,
  enabled = true
) {
  return {
    _id: id,
    message,
    user,
    loading,
    fail,
    time,
    enabled,
    type,
  };
}

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    initialized: false,
    // all messages
    messages: {},
    enabled: false,
    // current chat
    chatId: -1,
    type: 0,
    users: [],
  },
  reducers: {
    setInitialized: (state, action) => {
      state.initialized = action.payload;
    },
    setData: (state, action) => {
      return {
        ...state,
        ...action.payload,
        enabled: true,
        chatId: action.payload.chatId,
      };
    },
    setMessages: (state, action) => {
      action.payload.messages.forEach((messgae) => (messgae.enabled = true));
      state.messages[action.payload._id] = action.payload.messages;
    },
    setAllMessages: (state, action) => {
      let messageObj = {};
      action.payload.forEach((messgae) => {
        if (!messageObj[messgae.chatId]) {
          messageObj[messgae.chatId] = [messgae];
        } else {
          messageObj[messgae.chatId].push(messgae);
        }
        messgae.enabled = true;
      });
      state.messages = messageObj;
    },
    addMessage: (state, action) => {
      console.log("Add message, ", action.payload);
      if (state.messages[action.payload.chatId]) {
        let exist = false;
        state.messages[action.payload.chatId].forEach((message) => {
          if (message._id == action.payload.messageId && message.enabled)
            exist = true;
        });
        if (!exist) {
          console.log("Add Message");
          state.messages[action.payload.chatId] = [
            ...state.messages[action.payload.chatId],
            constructMessage(
              action.payload.messageId,
              action.payload.message,
              action.payload.userId,
              action.payload.time,
              action.payload.type,
            ),
          ];
        }
      } else {
        state.messages[action.payload.chatId] = [
          constructMessage(
            action.payload.messageId,
            action.payload.message,
            action.payload.userId,
            action.payload.time,
            action.payload.type,
          ),
        ];
      }
    },
    addLoadingMessage: (state, action) => {
      if (state.messages[action.payload.chatId]) {
        state.messages[action.payload.chatId] = [
          ...state.messages[action.payload.chatId],
          constructMessage(
            action.payload.randomId,
            action.payload.message,
            action.payload.userId,
            action.payload.time,
            action.payload.type,
            true
          ),
        ];
      }
    },
    // action randomId
    resetLoadingMessage(state, action) {
      if (state.messages[action.payload.chatId]) {
        state.messages[action.payload.chatId].forEach((message) => {
          if (message._id === action.payload.randomId) {
            message._id = action.payload.realId;
            message.loading = false;
            message.time = action.payload.time;
            message.enabled = false;
          }
        });
      }
    },
    failMessage(state, action) {
      if (state.messages[action.payload.chatId]) {
        state.messages[action.payload.chatId].forEach((message) => {
          if (message._id === action.payload.randomId) {
            message.loading = false;
            message.fail = true;
          }
        });
      }
    },
    disableDiagram(state, action) {
      state.enabled = false;
    },
    enableDiagram(state, action){
      state.enabled = true;
    }
  },
});

// Action creators are generated for each case reducer function

export const {
  setInitialized,
  setAllMessages,
  setData,
  setMessages,
  addMessage,
  addLoadingMessage,
  resetLoadingMessage,
  failMessage,
  disableDiagram,
  enableDiagram,

} = messageSlice.actions;

export default messageSlice.reducer;
