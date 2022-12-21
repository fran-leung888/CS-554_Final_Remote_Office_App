import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./component/Home";
import Login from "./component/Login";
import UserAdd from "./component/UserAdd";
import "@khanacademy/tota11y";
// import SearchUser from "./component/SearchUser";
import {
  Link,
  Routes,
  BrowserRouter as Router,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import UserDetail from "./component/UserDetail";
import Friends from "./component/Friends";
import { AuthContext, AuthProvider } from "./component/Auth";
import { useContext, useEffect, useState } from "react";
import PrivateRoute from "./component/PrivateRoute";
import { useSnackbar } from "notistack";
import noti from "./data/notification";
import MyAccount from "./component/MyAccount";
import constant from "./data/constant";
import { setUser } from "./data/redux/userSlice";
import users from "./data/users";
import { checkRes } from "./utils/verificationUtils";
import { addChat } from "./data/redux/chatSlice";
function App({ socket }) {
  const { currentUser } = useContext(AuthContext);
  const curUser = useSelector((state) => state.user);
  console.debug("current user", currentUser);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  console.log("Socket in app is ", socket);
  const dispatch = useDispatch();
  // config behaviour when socket disconnects.
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket get connected!!!", socket);
      // enqueueSnackbar("Connection has built", noti.successOpt);
    });
    socket.on("disconnect", () => {
      console.log("Socket get disconnected!!!", socket);
      enqueueSnackbar("Connection is unstable", noti.errOpt);
    });
    console.log("add listeners.");
    socket
      .listeners(constant.event.newChat)
      .forEach((listener) => socket.off(constant.event.newChat, listener));
    if (curUser._id) {
      const newChatListener = async (data) => {
        console.log("receive chat on newChat event.", data);
        if (data._id) {
          socket.emit("joinRoom", data._id);
          dispatch(addChat(data));
        }
        // refresh user infomation
        if (data.type === constant.chatType.group) {
          try {
            let res = await users.getUser(curUser._id);
            checkRes(res);
            if (res.data) {
              dispatch(setUser(res.data));
            }
          } catch (e) {
            enqueueSnackbar(e.toString(), noti.errOpt);
          }
        }
      };
      socket.on(constant.event.newChat, newChatListener);
    }
    socket
      .listeners(constant.event.newFriend)
      .forEach((listener) => socket.off(constant.event.newFriend, listener));
    if (curUser._id) {
      const newFriendListener = async (data) => {
        console.log("receive chat on newFriend event.", data, curUser);
        // refresh user.
        try {
          if (curUser._id) {
            console.log("newFriend refresh user", curUser._id);
            let res = await users.getUser(curUser._id);
            checkRes(res);
            if (res.data) {
              dispatch(setUser(res.data));
            }
          }
        } catch (e) {
          enqueueSnackbar(e.toString(), noti.errOpt);
        }
      };
      socket.on(constant.event.newFriend, newFriendListener);
    }
    socket
      .listeners(constant.event.newGroupUser)
      .forEach((listener) => socket.off(constant.event.newGroupUser, listener));
    if (curUser._id) {
      const newGroupUserListener = async (data) => {
        console.log("receive newGroupUser event.", data);
        // refresh user.
        try {
          let res = await users.getUser(curUser._id);
          checkRes(res);
          if (res.data) {
            dispatch(setUser(res.data));
          }
        } catch (e) {
          enqueueSnackbar(e.toString(), noti.errOpt);
        }
      };
      socket.on(constant.event.newGroupUser, newGroupUserListener);
    }
    socket
      .listeners(constant.event.refreshUser)
      .forEach((listener) => socket.off(constant.event.refreshUser, listener));
    if (curUser._id) {
      const refreshUserListener = async (data) => {
        console.log("receive refreshUser event.", data);
        // refresh user.
        try {
          let res = await users.getUser(curUser._id);
          console.log("refreshUser res.", res);

          checkRes(res);
          if (res.data) {
            dispatch(setUser(res.data));
            console.log("refreshUser set user.", res.data);
          }
        } catch (e) {
          enqueueSnackbar(e.toString(), noti.errOpt);
        }
      };
      socket.on(constant.event.refreshUser, refreshUserListener);
    }
  }, [curUser]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {PrivateRoute({
            loggedIn: !!currentUser._id,
            path: "/home",
            element: <Home socket={socket} />,
          })}
          {PrivateRoute({
            loggedIn: !!currentUser._id,
            path: "/search",
            element: <UserDetail socket={socket} />,
          })}
          {PrivateRoute({
            loggedIn: !!currentUser._id,
            path: "/invite",
            element: <UserAdd socket={socket} />,
          })}
          {PrivateRoute({
            loggedIn: !!currentUser._id,
            path: "/friends",
            element: <Friends socket={socket} />,
          })}
          {PrivateRoute({
            loggedIn: !!currentUser._id,
            path: "/myaccount",
            element: <MyAccount />,
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
