import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./component/Home";
import Login from "./component/Login";
import UserAdd from "./component/UserAdd";
// import SearchUser from "./component/SearchUser";
import { Link, Routes, BrowserRouter as Router, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { setError, resetError } from "./data/redux/errorSlice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import UserDetail from "./component/UserDetail";
import Friends from "./component/Friends";
import { AuthContext, AuthProvider } from "./component/Auth"
import { useContext } from "react";
import PrivateRoute from "./component/PrivateRoute";

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
  // const status = useSelector((state) => state.error.status)
  // const description = useSelector((state) => state.error.description)
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);

  return (
      <div>
        <Modal
          open={error.status}
          onClose={() => {
            dispatch(resetError());
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {error.description}
            </Typography>
          </Box>
        </Modal>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            {PrivateRoute({loggedIn: !!currentUser, path:"/home", element: <Home socket={socket} />})}
            {PrivateRoute({loggedIn: !!currentUser, path:"/search", element: <UserDetail socket={socket} />})}
            {PrivateRoute({loggedIn: !!currentUser, path:"/invite", element: <UserAdd socket={socket} />})}
            {PrivateRoute({loggedIn: !!currentUser, path:"/friends", element: <Friends />})}
          </Routes>
        </Router>
      </div>
  );
}

export default App;
