import { createSlice } from "@reduxjs/toolkit";

function constructChat(
  _id,
  users,
  type = 0,
  show = false,
  groupName = null,
) {
  return {
    _id,
    users,
    type,
    show,
    groupName,
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
    readed: [],
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
            action.payload.show ? action.payload.show : false,
            action.payload.groupName,
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
    addUsers: (state, action) => {
      console.log("add users in redux", action.payload);
      action.payload.forEach((user) => {
        state.users[user._id] = user;
      });
    },
    reset: (state, action) => {
      return {
        initialized: false,
        users: {},
        chats: [],
        readed: [],
      };
    },
    setBurned: (state, action) => {
      //
      let readed = [];
      action.payload.forEach((each) => {
        readed.push(each.messageId);
      });
      return {
        ...state,
        readed,
      };
    },
    burnMessage: (state, action) => {
      state.readed = [...state.readed, action.payload.messageId];
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
  addUsers,
  reset,
  setBurned,
  burnMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
