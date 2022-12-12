import { configureStore } from "@reduxjs/toolkit";
import {
  composeWithDevTools,
  devToolsEnhancer,
} from "redux-devtools-extension";
import userSlice from "./userSlice";
import errorSlice from "./errorSlice";
import searchUser from "./searchUser";

export default configureStore({
  reducer: {
    user: userSlice,
    searchUser: searchUser,
    error: errorSlice,
  },
});
