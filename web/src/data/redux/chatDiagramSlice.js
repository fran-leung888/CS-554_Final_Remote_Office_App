import { createSlice } from "@reduxjs/toolkit";

function constructMessage(
  id,
  message,
  user,
  time,
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
  };
}

export const chatDiagramSlice = createSlice({
  name: "chatDiagram",
  initialState: {
    _id: -1,
    type: 0,
    messages: {},
    users: [],
    enabled: false,
  },
  reducers: {
    setData: (state, action) => {
      return { ...state, ...action.payload, enabled: true };
    },
    setMessages: (state, action) => {
      action.payload.messages.forEach((messgae) => (messgae.enabled = true));
      state.messages[action.payload._id] = action.payload.messages;
    },
    addMessage: (state, action) => {
      console.log("test Add Message");
      if (state.messages[action.payload._id]) {
        let exist = false;
        state.messages[action.payload._id].forEach((message) => {
          if (message._id == action.payload.messageId && message.enabled)
            exist = true;
        });
        if (!exist) {
          console.log("Add Message");
          state.messages[action.payload._id] = [
            ...state.messages[action.payload._id],
            constructMessage(
              action.payload.messageId,
              action.payload.message,
              action.payload.user,
              action.payload.time
            ),
          ];
        }
      }
    },
    addLoadingMessage: (state, action) => {
      if (state.messages[action.payload._id]) {
        state.messages[action.payload._id] = [
          ...state.messages[action.payload._id],
          constructMessage(
            action.payload.randomId,
            action.payload.message,
            action.payload.user,
            action.payload.time,
            true
          ),
        ];
      }
    },
    // action randomId
    resetLoadingMessage(state, action) {
      if (state.messages[action.payload._id]) {
        state.messages[action.payload._id].forEach((message) => {
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
      if (state.messages[action.payload._id]) {
        state.messages[action.payload._id].forEach((message) => {
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
  },
});

// Action creators are generated for each case reducer function

export const {
  setData,
  setMessages,
  addMessage,
  addLoadingMessage,
  resetLoadingMessage,
  failMessage,
  disableDiagram,
} = chatDiagramSlice.actions;

export default chatDiagramSlice.reducer;
