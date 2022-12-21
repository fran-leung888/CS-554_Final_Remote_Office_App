import React from "react";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import ChatList from "./chats/ChatList";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import FunctionBar from "./FunctionBar";
import Content from "./Content";
import ChatDiagram from "./chats/ChatDiagram";
import constant from "../data/constant";
import { addChat, burnMessage } from "../data/redux/chatSlice";
import "../App.css";

import groups from "../data/groups";
import users from "../data/users";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import { setUser } from "../data/redux/userSlice";
import { checkRes } from "../utils/verificationUtils";
import { useSnackbar } from "notistack";
import noti from "../data/notification";

export default ({ socket }) => {
  const [showInvite, setShowInvite] = useState(false);
  const [showGroupInvite, setShowGroupInvite] = useState(false);
  const [applyUser, setApplyuser] = useState(undefined);
  const [groupData, setGroupData] = useState(undefined);
  const [accept, setAccept] = useState(false);
  const [reject, setReject] = useState(false);
  const [rejectData, setRejectData] = useState(undefined);
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const curUser = useSelector((state) => state.user);
  console.log("Home user is", curUser);
  console.log("socket in home", socket);
  useEffect(() => {
    if (curUser) {
      // socket.current = io("http://localhost:3000");
      // socket.current.emit("addUser", curUser._id);
      socket.emit("addUser", curUser._id);
    }
    if (curUser._id) {
      socket.emit("joinRoom", curUser._id);
    }
    
  }, []);

  socket.on("addFriendResponse", (data) => {
    console.log(`data`);
    console.log(data);
    if (data) {
      setApplyuser(data);
      setShowInvite(true);
    } else {
      setApplyuser(undefined);
      setShowInvite(false);
    }
    console.log(data);
  });

  socket.on("inviteResponse", (data) => {
    setGroupData(data);
    console.log("invite response data:");
    console.log(groupData);
    if (data && data.invite && data.invite._id === curUser._id) {
      setShowGroupInvite(true);
    } else {
      setShowGroupInvite(false);
    }
  });

  socket.on("agreeResponse", (data) => {
    setRejectData(data);
    console.log(`Agree response:`);
    console.log(data);
    if (data && data.applyId && data.applyId === curUser._id) {
      setReject(!data.agree);
    } else {
      setReject(true);
    }
  });

  const agree = async () => {
    let add = await users.addFriend(
      applyUser.applyId,
      curUser?._id?.toString()
    );
    console.log("add friend:");
    console.log(add);

    socket.emit("agree", {
      agree: true,
      applyId: applyUser.applyId,
      applyUsername: applyUser.applyUsername,
      friendId: applyUser.friendId,
      friendUsername: applyUser.friendUsername,
    });
    setShowInvite(false);
  };

  const disagree = () => {
    socket.emit("agree", {
      agree: false,
      applyId: applyUser.applyId,
      applyUsername: applyUser.applyUsername,
      friendId: applyUser.friendId,
      friendUsername: applyUser.friendUsername,
    });
  };

  const agreeGroup = async () => {
    const memberId = groupData.invite._id;
    const groupName = groupData.group.groupName;
    let newUser = await groups.addToGroup(memberId, groupName);
    console.log("after accept add to group, update the curUse data:");
    console.log(newUser);
    dispatch(setUser(newUser.data));

    socket.emit("addGroup", {
      agree: true,
      agreeUser: curUser,
      grouper: groupData.invite,
      grouperId: groupData.grouperId,
      group: groupData.group,
    });
    setShowGroupInvite(false);
  };

  const disagreeGroup = async () => {
    console.log("emit disagree info");
    socket.emit("addGroup", {
      agree: false,
      agreeUser: curUser,
      grouper: groupData.invite,
      grouperId: groupData.grouperId,
      group: groupData.group,
    });
    setShowGroupInvite(false);
  };

  console.log(showInvite);
  console.log(showGroupInvite);
  console.log(socket);
  return (
    <Grid container sx={{ height: "100%" }}>
      {showInvite ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          {/* <Card className="text-center"> */}
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>{`${applyUser.applyUsername} want to become your friend`}</Modal.Title>
            </Modal.Header>
            {/* <Card.Body> */}
            <Modal.Body>
              <Button variant="info" onClick={agree}>
                Agree
              </Button>
              <Button variant="info" onClick={disagree}>
                Disagree
              </Button>
              {/* </Card.Body> */}
            </Modal.Body>
            {/* </Card> */}
          </Modal.Dialog>
        </div>
      ) : (
        ""
      )}
      {showGroupInvite ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>{`${groupData.grouper} want to invite you add ${groupData.group.groupName}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button variant="primary" onClick={agreeGroup}>
                Agree
              </Button>
              <Button variant="primary" onClick={disagreeGroup}>
                Disagree
              </Button>
            </Modal.Body>
          </Modal.Dialog>
        </div>
      ) : (
        ""
      )}
      <Grid item className="Function-Bar">
        <FunctionBar></FunctionBar>
      </Grid>
      <Grid item xs={2}>
        <Content></Content>
      </Grid>
      <Grid item xs sx={{ height: "100%" }}>
        <ChatDiagram></ChatDiagram>
      </Grid>
    </Grid>
  );
};
