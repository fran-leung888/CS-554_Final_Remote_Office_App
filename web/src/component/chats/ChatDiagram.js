import React, { useState } from "react";
import { useSelector } from "react-redux";
import MessageList from "./MessageList";
import SendArea from "./SendArea";
import { Grid } from "@mui/material";
export default function ChatDiagram() {
  // No message show no list
  const chatData = useSelector((state) => state.message);
  const enabled = useSelector((state) => state.message.enabled);
  const chatId = useSelector((state) => state.message.chatId);
  console.log("chatDiagram redux is ", chatData);
  if (!enabled || chatId === -1) {
    console.log("no message, no diagram.");
    return <div>no message</div>;
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
