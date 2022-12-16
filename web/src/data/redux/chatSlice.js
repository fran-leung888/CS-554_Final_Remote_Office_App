import { createSlice } from "@reduxjs/toolkit";

function constructChat(_id, users, type = 0, show = false) {
  return {
    _id,
    users,
    type,
    show,
  };
}

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    initialized: false,
    // {
    //     id,
    //      users,
    //      temporary
    //      type
    // }
    users: {},
    chats: [],
  },
  reducers: {
    setInitialized: (state, action) => {
      state.initialized = action.payload;
    },
    setData: (state, action) => {
      console.log("Set chat data.");
      // Keep Temp Chats
      let tempChats = [];
      state.chats.forEach((chat) => {
        if (chat.temporary) tempChats.push(chat);
      });
      state.chats = [...tempChats, ...action.payload];
    },
    //input user list
    setUsers: (state, action) => {
      action.payload.forEach((user) => {
        state.users[user._id] = user;
      });
    },
    addChat: (state, action) => {
      console.log("Add Chat ", action.payload);
      let exist = false;
      state.chats.forEach((chat) => {
        if (chat._id === action.payload._id) exist = true;
      });
      if (!exist) {
        state.chats = [
          constructChat(
            action.payload._id,
            action.payload.users,
            action.payload.type,
            action.payload.show ? action.payload.show : false
          ),
          ...state.chats,
        ];
      }
    },
    resetTemporary: (state, action) => {
      state.chats.forEach((chat) => {
        if (chat._id == action.payload._id) chat.temporary = false;
      });
    },
    showChat: (state, action) => {
      console.log("show chat, ", action.payload);
      state.chats.forEach((chat) => {
        if (chat._id == action.payload) chat.show = true;
      });
    },
  },
});

// Action creators are generated for each case reducer function

export const {
  setInitialized,
  setUsers,
  setData,
  addChat,
  resetTemporary,
  showChat,
} = chatSlice.actions;

export default chatSlice.reducer;
