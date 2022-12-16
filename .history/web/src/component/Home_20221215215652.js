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
import SignOutButton from "./SignOut";
import UserAdd from "./UserAdd";

export default ({ socket }) => {
  const [showInvite, setShowInvite] = useState(false);
  const [showGroupInvite, setShowGroupInvite] = useState(false);
  const [applyUser, setApplyuser] = useState(undefined);

  const curUser = useSelector((state) => state.user);
  console.log(curUser);

  useEffect(() => {
    if (curUser) {
      // socket.current = io("http://localhost:3000");
      // socket.current.emit("addUser", curUser._id);
      socket.emit("addUser", curUser._id);
    }
  }, [curUser]);

  const navigate = useNavigate();
  const invite = () => {
    navigate("/invite");
  };

  const friends = () => {
    navigate("/friends");
  };

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

  return (
    <Grid container>
      {showGroupInvite || showInvite ? (
        <UserAdd showInvite={showInvite} showGroupInvite={showGroupInvite} />
      ) : (
        ""
      )}
      <Grid item xs={1}>
        <FunctionBar></FunctionBar>
      </Grid>
      <Grid item xs={4}>
        <Content></Content>
      </Grid>
      <Grid item xs={7}>
        <ChatDiagram></ChatDiagram>
      </Grid>
      <Grid item xs={4}>
        <Button onClick={invite}>Invite</Button>
      </Grid>
      <Grid item xs={4}>
        <Button onClick={friends}>My friends</Button>
      </Grid>
      <Grid item xs={2}>
        <SignOutButton />
      </Grid>
    </Grid>
  );
};
