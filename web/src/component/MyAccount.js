import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../firebase/FirebaseFunctions";

import users from "../data/users";
import { setUser } from "../data/redux/userSlice";
import {
  verifyString,
  checkResult,
  checkRes,
  verifyObj,
} from "../utils/verificationUtils";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import TextField from "@mui/material/TextField";

export default function MyAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");
  const [newPassword, setPassword] = useState("");
  const [showChangeName, setShowChangeName] = useState(false);
  const [showChangePswd, setShowChangePswd] = useState(false);
  const curUser = useSelector((state) => state.user);
  console.log(curUser);

  const openChangeName = () => {
    setShowChangeName(true);
  };

  const openChangePassword = () => {
    setShowChangePswd(true);
  };
  const changeName = async () => {
    checkResult(verifyString(newName));
    console.log(newName);

    const newCurUser = await users.setNewName(newName);
    console.log(newCurUser);

    if (!newCurUser.data) {
      return <div>Set Unsuccess, Please try again!</div>;
    } else {
      dispatch(setUser(newCurUser.data));
    }

    setShowChangeName(false);
  };

  const changePassword = async () => {
    checkResult(verifyString(newPassword));
    console.log(newPassword);

    const newCurUser = await users.setNewPswd(newPassword);
    console.log(newCurUser.data);

    if (!newCurUser.data) {
      return <div>Set Unsuccess, Please try again!</div>;
    } else {
      dispatch(setUser({}));
      doSignOut();
      localStorage.clear();
      setShowChangePswd(false);
      return <div>Success change, please re-login!</div>;
    }
  };

  // const closeChangeName = () => {
  //   setShowChangeName(false);
  // };

  const closeChangePswd = () => {
    setShowChangePswd(false);
  };

  return (
    <div>
      <Card
        style={{ width: "20rem", height: "400px", left: "100px", top: "100px" }}
      >
        <Card.Body>
          <Card.Title style={{ padding: "3rem" }}>
            Username: {curUser.username}
          </Card.Title>
          <Card.Subtitle
            className="mb-2 text-muted"
            style={{
              paddingLeft: "3rem",
              paddingBottom: "7rem",
              paddingTop: "1rem",
            }}
          >
            Name: {curUser.name}
          </Card.Subtitle>
          <Card.Text style={{ paddingLeft: "3rem" }}>
            <Card.Link onClick={openChangeName}>Change name</Card.Link>
            <br />
            <br />
            <Card.Link onClick={openChangePassword}>Change password</Card.Link>
          </Card.Text>
        </Card.Body>
      </Card>
      {showChangeName ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="changeName">
                <Form.Label>New Name</Form.Label>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" onClick={changeName}>
                Save changes
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      ) : (
        ""
      )}

      {showChangePswd ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="changeName">
                <Form.Label>New Password</Form.Label>
                <TextField
                  autoFocus
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" onClick={changePassword}>
                Save changes
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
