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
import ActionBar from "./ActionBar";

import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useSnackbar } from "notistack";
import noti from "../../data/notification";
import constant from "../../data/constant";
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
          type: constant.messageType.text,
        })
      );
      let res = await chatData.sendMessage(chatId, messageToSend, currentUser, constant.messageType.text);
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
    <div>
      <Grid container>
        <Grid item ><ActionBar></ActionBar></Grid>
        <Grid item xs={12}>
          <FormControl>
            <TextField
              sx={{ overflow: "auto" }}
              placeholder="Type your message here."
              multiline
              rows={2}
              maxRows={4}
              value={messageToSend}
              onChange={(e) => {
                setMessageToSend(e.target.value);
              }}
            ></TextField>
          </FormControl>
        </Grid>
        <Grid item>
          <Button sx={{ textTransform: "none" }} onClick={handleSend}>
            Send(S)
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
