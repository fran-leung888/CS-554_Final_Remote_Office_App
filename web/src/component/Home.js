import React from "react";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import ChatList  from "./chats/ChatList";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import FunctionBar from "./FunctionBar";
import Content from './Content'
import ChatDiagram from "./chats/ChatDiagram";

export default ({ socket }) => {
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
  return (
    <Grid container>
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
    </Grid>
  );
};
