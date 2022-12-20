import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress, Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import MessageItem from "./MessageItem";
export default function MessageList() {
  const messagesEndRef = useRef(null);
  const chatId = useSelector((state) => state.message.chatId);
  const messages = useSelector((state) => state.message.messages[chatId]);
  console.log("Chat messages are ", messages);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    console.log("scorll");
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
  }, [messages]);

  const buildMessages = (messages) => {
    return (
      messages &&
      messages.map((message) => {
        // name, time, message
        // loading status indicated by message.loading
        return message.enabled ? (
          <Item id={message._id}>
            <MessageItem data={message}></MessageItem>
          </Item>
        ) : (
          ""
        );
      })
    );
  };

  // get all messages and render each
  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Box>
        <Stack spacing={0}>{buildMessages(messages)}</Stack>
        <div ref={messagesEndRef}></div>
      </Box>
    </div>
  );
}
