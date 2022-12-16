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
import constant from "../data/constant";
import { useDispatch } from "react-redux";
import { addChat } from "../data/redux/chatSlice";
export default ({ socket }) => {
  const curUser = useSelector((state) => state.user);
  console.log(curUser);
  console.log("socket in home", socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (curUser) {
      // socket.current = io("http://localhost:3000");
      // socket.current.emit("addUser", curUser._id);
      socket.emit("addUser", curUser._id);
    }
    socket.emit("joinRoom", curUser._id);
    socket.on(constant.event.newChat, (data) => {
      console.log("receive chat on newChat event.", data);
      socket.emit("joinRoom", data._id);
      dispatch(addChat(data));
    });
  });

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
      <Grid item xs={2}>
        <SignOutButton />
      </Grid>
    </Grid>
  );
};
