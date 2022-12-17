import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import {
  combineReducers,
  configureStore,
  createStore
} from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
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


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const reducer = combineReducers({
  user: userSlice,
  searchUser: searchUser,
  error: errorSlice,
  status: statusSlice,
  message: messageSlice,
  chat: chatSlice
});

const persistedReducer = persistReducer(persistConfig, reducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

export const store = configureStore({ reducer: {
  user: userSlice,
  searchUser: searchUser,
  error: errorSlice,
  status: statusSlice,
  message: messageSlice,
  chat: chatSlice
} });

export const persistor = persistStore(store)

export default store