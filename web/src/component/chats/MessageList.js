import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress } from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
export default function MessageList() {
  const _id = useSelector((state) => state.chatDiagram._id);
  const messages = useSelector((state) => state.chatDiagram.messages[_id]);
  console.log(messages);
  const buildMessages = (messages) => {
    return (
      messages &&
      messages.map((message) => {
        // name, time, message
        // loading status indicated by message.loading
        return message.enabled ? (
          <Grid container item>
            <Grid item>
              {message.loading && <CircularProgress size={14} />}
            </Grid>
            <Grid item>{message.fail && <PriorityHighIcon size={14} />}</Grid>
            <Grid item>{message.name}</Grid>
            <Grid item>{message.message}</Grid>
            <Grid item>{message.time}</Grid>
          </Grid>
        ) : (
          <div></div>
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
