import { configureStore } from "@reduxjs/toolkit";
import {
  composeWithDevTools,
  devToolsEnhancer,
} from "redux-devtools-extension";
import userSlice from "./userSlice";
import errorSlice from "./errorSlice";
import searchUser from "./searchUser";
import statusSlice from "./statusSlice";
import messageSlice from "./messageSlice";
import chatSlice from "./chatSlice";
import { createStore, combineReducers  } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

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

const store = configureStore({ reducer: persistedReducer });

export const persistor = persistStore(store);
export default store;
