import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress, Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
export default function MessageList() {
  const chatId = useSelector((state) => state.message.chatId);
  const messages = useSelector((state) => state.message.messages[chatId]);
  console.log('Chat messages are ', messages);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const buildMessages = (messages) => {
    return (
      messages &&
      messages.map((message) => {
        // name, time, message
        // loading status indicated by message.loading
        return message.enabled ? (
          <Item id={message._id}>
            <Grid container item>
              <Grid item>
                <Avatar sx={{ width: 24, height: 24 }}></Avatar>
              </Grid>
              <Grid item>
                {message.loading && <CircularProgress size={14} />}
              </Grid>
              <Grid item>{message.fail && <PriorityHighIcon size={14} />}</Grid>
              <Grid item>{message.name}</Grid>
              <Grid item>{message.message}</Grid>
              <Grid item>{message.time}</Grid>
            </Grid>
          </Item>
        ) : (
          ""
        );
      })
    );
  };

  if (chatId !== -1) {
    // get all messages and render each
    return (
      <Box sx={{ maxHeight: "500px", width: "100%", overflow: "auto" }}>
        <Stack spacing={0}>{buildMessages(messages)}</Stack>
      </Box>
    );
  } else {
    return <Grid container>No Messages</Grid>;
  }
}
