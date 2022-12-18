import {
  persistStore,
  persistReducer,
} from 'redux-persist'
import {
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'

import userSlice from "./userSlice";

import searchUser from "./searchUser";
import statusSlice from "./statusSlice";
import messageSlice from "./messageSlice";
import chatSlice from "./chatSlice";


const persistConfig = {
  key: "root",
  storage,
  blacklist: ['chat', 'message', 'searchUser']
};

const reducer = combineReducers({
  user: userSlice,
  searchUser: searchUser,
  status: statusSlice,
  message: messageSlice,
  chat: chatSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({ reducer: persistedReducer });

export const persistor = persistStore(store);
export default store;
