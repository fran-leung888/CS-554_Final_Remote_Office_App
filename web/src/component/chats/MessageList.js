import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import users from "../../data/users";
import { setSearchUser } from "../../data/redux/searchUser";
import { Grid } from "@mui/material";

export default function MessageList() {
  const _id = useSelector((state) => state.chatDiagram._id);
  const messages = useSelector((state) => state.chatDiagram.messages);
  console.log(messages)
  const buildMessages = (messages) => {
    return (
      messages &&
      messages.map((message) => {
        // name, time, message
        return (
          <Grid container item>
            <Grid item>{message.name}</Grid>
            <Grid item>{message.time}</Grid>
            <Grid item>{message.message}</Grid>
          </Grid>
        );
      })
    );
  };

  if (_id !== -1) {
    // get all messages and render each
    return <div>{buildMessages(messages)}</div>;
  } else {
    return <Grid container>No Messages</Grid>;
  }
}
