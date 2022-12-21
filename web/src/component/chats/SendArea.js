import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { Grid, TextField, FormControl } from "@mui/material";
import chatData from "../../data/chats";
import {
  verifyString,
  checkResult,
  checkRes,
  verifyObj,
} from "../../utils/verificationUtils";
import {
  addLoadingMessage,
  resetLoadingMessage,
  setMessageToFail,
} from "../../data/redux/messageSlice";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ActionBar from "./ActionBar";

import { useSnackbar } from "notistack";
import noti from "../../data/notification";
import constant from "../../data/constant";
import { UploadButton } from "../UploadButton";
export default function SendArea(props) {
  const [textMessage, setTextMessage] = useState("");
  const currentUser = useSelector((state) => state.user);
  const chatId = useSelector((state) => state.message.chatId);
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleSend = async (messageType, messageToSend) => {
    if (messageType === constant.messageType.burn)
      messageToSend = JSON.stringify(messageToSend);
    console.log("Send message by handleSend", messageToSend);
    let tempMessageId;
    try {
      // add message to redux and set it as loading
      if (!verifyString(messageToSend).valid) throw "Message can not be empty.";
      tempMessageId = Math.random();
      dispatch(
        addLoadingMessage({
          chatId,
          randomId: tempMessageId,
          message: messageToSend,
          userId: currentUser._id,
          type: messageType,
        })
      );
      let res = await chatData.sendMessage(
        chatId,
        messageToSend,
        currentUser,
        messageType
      );
      checkRes(res);
      dispatch(
        resetLoadingMessage({
          chatId,
          randomId: tempMessageId,
          realId: res.data.insertedId,
          time: res.data.time,
        })
      );
      setTextMessage("");
    } catch (e) {
      enqueueSnackbar(e.toString(), noti.errOpt);
      dispatch(
        setMessageToFail({
          chatId,
          randomId: tempMessageId,
        })
      );
    }
  };

  return (
    <Grid container>
      <Grid container item xs={12} justifyContent="flex-start">
        <ActionBar chatId={chatId} handleSend={handleSend}></ActionBar>
      </Grid>
      <Grid item xs={12}>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            sx={{ overflow: "auto", color: "black"}}
            placeholder="Type your message here."
            multiline
            rows={2}
            value={textMessage}
            onChange={(e) => {
              setTextMessage(e.target.value);
            }}
          ></TextField>
        </FormControl>
      </Grid>
      <Grid container item xs={12} justifyContent="flex-end">
        <Button
          sx={{ textTransform: "none" }}
          onClick={() => {
            handleSend(constant.messageType.text, textMessage);
          }}
        >
          Send(S)
        </Button>
      </Grid>
    </Grid>
  );
}
