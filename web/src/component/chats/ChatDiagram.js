import React, { useState } from "react";
import { useSelector } from "react-redux";
import MessageList from "./MessageList";
import SendArea from "./SendArea";
import { Grid } from "@mui/material";

export default function ChatDiagram() {
  // No message show no list
  const chatData = useSelector((state) => state.chatDiagram);
  console.log("chatDiagram redux is ", chatData);
  if (!chatData.enabled) {
    console.log('no message, no diagram.')
    return <div></div>;
  } else {
    return (
      <Grid
        container
        item
        direction={"column"}
        justifyContent="space-around"
        alignItems="stretch"
      >
        <Grid item>
          <MessageList></MessageList>
        </Grid>
        <Grid item>
          <SendArea></SendArea>
        </Grid>
      </Grid>
    );
  }
}
