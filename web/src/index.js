import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { io } from "socket.io-client";
import { Provider } from "react-redux";
import { persistor, store } from "./data/redux/store";
import { AuthProvider } from "./component/Auth";
import { SocketContext } from "./socketContext";
import { SnackbarProvider } from "notistack";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor } from "./data/redux/store";
import { CircularIndeterminate } from './component/CircularIndeterminate'

const socket = io();
console.log("Socket in index.js is", socket);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <SocketContext.Provider value={socket}>
            <App socket={socket} />
          </SocketContext.Provider>
        </AuthProvider>
      </SnackbarProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
