import { createSlice } from "@reduxjs/toolkit";

function constructMessage(id, message, user, loading = false) {
  return {
    _id: id,
    message,
    user,
    loading,
  };
}

export const chatDiagramSlice = createSlice({
  name: "chatDiagram",
  initialState: {
    _id: -1,
    type: 0,
    messages: [],
    users: [],
  },
  reducers: {
    setData: (state, action) => {
      return { ...state, ...action.payload, messages:[] };
    },
    setMessages: (state, action) => {
      state.messages = action.payload.messages
    },
    addLoadingMessage: (state, action) => {
      console.log('add loading message.', constructMessage(
        action.payload.randomId,
        action.payload.message,
        action.payload.user,
        true
      ))
      state.messages = [
        ...state.messages,
        constructMessage(
          action.payload.randomId,
          action.payload.message,
          action.payload.user,
          true
        ),
      ];
    },
    // action randomId
    resetLoadingMessage(state, action) {
      state.messages.forEach((message) => {
        if ((message._id === action.payload.randomId)) {
          message._id = action.payload.realId;
          message.loading = false;
        }
      });
    },
    reset(state, action) {
      state._id = -1;
    },
  },
});

// Action creators are generated for each case reducer function

export const { setData, setMessages, addLoadingMessage, resetLoadingMessage, reset } =
  chatDiagramSlice.actions;

export default chatDiagramSlice.reducer;
