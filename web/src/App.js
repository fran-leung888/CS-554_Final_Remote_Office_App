import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./component/Home";
import Login from "./component/Login";
import UserAdd from "./component/UserAdd";
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
import { useContext, useEffect } from "react";
import PrivateRoute from "./component/PrivateRoute";
import { useSnackbar } from "notistack";
import noti from "./data/notification";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App({ socket }) {
  const { currentUser } = useContext(AuthContext);
  console.debug("current user", currentUser);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  console.log("Socket in app is ", socket);

  // config behaviour when socket disconnects.
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket get connected!!!", socket);
      enqueueSnackbar("Connection has built", noti.successOpt);
    });
    socket.on("disconnect", () => {
      console.log("Socket get disconnected!!!", socket);
      enqueueSnackbar("Connection is unstable", noti.errOpt);
    });
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/home" element={<Home socket={socket} />} />
          <Route path="/search" element={<UserDetail socket={socket} />} />
          <Route path="/invite" element={<UserAdd socket={socket} />} />
          <Route path="/friends" element={<Friends socket={socket} />} /> */}
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
            element: <Friends />,
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
