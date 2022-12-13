import { configureStore } from "@reduxjs/toolkit";
import {
  composeWithDevTools,
  devToolsEnhancer,
} from "redux-devtools-extension";
import userSlice from "./userSlice";
import errorSlice from "./errorSlice";
import searchUser from "./searchUser";
import statusSlice from "./statusSlice";
import chatDiagramSlice from "./chatDiagramSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    searchUser: searchUser,
    error: errorSlice,
    status: statusSlice,
    chatDiagram: chatDiagramSlice,
  },
});
