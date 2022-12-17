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
  failMessage,
} from "../../data/redux/messageSlice";

import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useSnackbar } from "notistack";
import noti from "../../data/notification";
export default function SendArea(props) {
  const [messageToSend, setMessageToSend] = useState("");
  const currentUser = useSelector((state) => state.user);
  const chatId = useSelector((state) => state.message.chatId);
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleSend = async () => {
    let tempMessageId, tempChatId;
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
        })
      );
      let res = await chatData.sendMessage(chatId, messageToSend, currentUser);
      checkRes(res);
      dispatch(
        resetLoadingMessage({
          chatId,
          randomId: tempMessageId,
          realId: res.data.insertedId,
          time: res.data.time,
        })
      );
      setMessageToSend("");
    } catch (e) {
      enqueueSnackbar(e, noti.errOpt);
      dispatch(
        failMessage({
          chatId,
          randomId: tempMessageId,
        })
      );
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl>
          <TextareaAutosize
            placeholder="Type your message here."
            value={messageToSend}
            onChange={(e) => {
              setMessageToSend(e.target.value);
            }}
          ></TextareaAutosize>
        </FormControl>
      </Grid>
      <Grid item>
        <Button onClick={handleSend}>Send</Button>
      </Grid>
    </Grid>
  );
}
