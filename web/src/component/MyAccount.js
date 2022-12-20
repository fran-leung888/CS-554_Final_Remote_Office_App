import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../firebase/FirebaseFunctions";

import users from "../data/users";
import { setUser, setAvatar } from "../data/redux/userSlice";
import {
  verifyString,
  checkResult,
  checkRes,
} from "../utils/verificationUtils";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import TextField from "@mui/material/TextField";
import { Avatar, Grid, IconButton } from "@mui/material";
import { getFileObjectUrl, uploadFile } from "../data/file";
import { useSnackbar } from "notistack";
import noti from "../data/notification";
export default function MyAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");
  const [newPassword, setPassword] = useState("");
  const [showChangeName, setShowChangeName] = useState(false);
  const [showChangePswd, setShowChangePswd] = useState(false);
  const curUser = useSelector((state) => state.user);
  const userAvatar = useSelector((state) => state.user.avatar);
  const avatarRef = useRef();
  console.log(curUser);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
    }
  };

  const myFriends = () => {
    navigate("/friends");
  };
  const backHome = () => {
    navigate("/home");
  };

  const uploadImage = async (event) => {
    console.log("selected file", event.target.files, event);
    const file = event.target.files[0];
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      enqueueSnackbar("Please choose a image", noti.errOpt);
    }
    event.target.value = "";
    const { data } = await uploadFile({ file });
    let res = await users.setAvatar(
      curUser._id.toString(),
      await getFileObjectUrl(data._id, 100)
    );
    checkRes(res);
    dispatch(setAvatar(res.data.avatar));
  };

  return (
    <div variant="Light">
      <Grid container alignItems={"center"} justifyContent="center">
        <Grid item>
          <IconButton
            color="primary"
            aria-label="upload file"
            component="label"
          >
            <input hidden type="file" ref={avatarRef} onChange={uploadImage} />
            <Avatar
              src={userAvatar}
              sx={{ width: 100, height: 100, textAlign: "center" }}
            ></Avatar>
          </IconButton>
        </Grid>
        <Grid item>
          <Card
            style={{
              width: "20rem",
              height: "400px",
              left: "100px",
              top: "100px",
              backgroundColor: "lightblue",
            }}
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
                <Card.Link onClick={openChangePassword}>
                  Change password
                </Card.Link>
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
                    Reset
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </div>
          ) : (
            ""
          )}

          <div style={{ paddingTop: "10rem", paddingLeft: "6rem" }}>
            <Button
              onClick={myFriends}
              variant="info"
              style={{
                paddingLeft: "2rem",
                paddingRight: "2rem",
                backgroundImage:
                  "linear-gradient( 135deg, #FFA6B7 10%, #1E2AD2 100%)",
              }}
            >
              My Friends
            </Button>{" "}
            <Button
              onClick={backHome}
              variant="info"
              style={{
                paddingLeft: "2rem",
                paddingRight: "2rem",
                backgroundImage:
                  "linear-gradient( 135deg, #FFA6B7 10%, #1E2AD2 100%)",
              }}
            >
              Back to home
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
