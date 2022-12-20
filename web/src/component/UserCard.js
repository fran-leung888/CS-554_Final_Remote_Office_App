import React, { useEffect, useRef, useContext } from "react";
import { Avatar, Button, Card, Grid, CardActions } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setContentStatus } from "../data/redux/statusSlice";
import SmsIcon from "@mui/icons-material/Sms";
import chats from "../data/chats";

import {
  verifyString,
  checkResult,
  checkRes,
  verifyObj,
} from "../utils/verificationUtils";
import { addChat, showChat } from "../data/redux/chatSlice";
import { enableDiagram, setData } from "../data/redux/messageSlice";
import constant from "../data/constant";
import { SocketContext } from "../socketContext";
import { useSnackbar } from "notistack";
import noti from "../data/notification";

export default (props) => {
  console.log("props.user", props.user);
  const currentUser = useSelector((state) => state.user);
  const userChats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const ChatWithUserOrGroup = async () => {
    if (props.user.groupId) {
      let chatId;
      userChats.forEach((chat) => {
        if (chat.groupId === props.user.groupId) chatId = chat._id;
      });
      dispatch(
        setData({
          chatId,
          type: constant.chatType.group,
          enabled: true,
        })
      );
      dispatch(setContentStatus(constant.status.content));
    } else {
      console.log(
        `Add chat from ${currentUser.username} to ${props.user?.username}`
      );
      // send server add chat request and jump to chat diagram.
      try {
        // check if there is a chat between users at local but no message in it
        let chatExist = false,
          chatId;
        userChats.forEach((chat) => {
          if (
            chat.type === constant.chatType.individual &&
            chat.users.includes(currentUser._id) &&
            chat.users.includes(props.user._id)
          ) {
            chatExist = true;
            chatId = chat._id;
            dispatch(showChat(chatId));
            dispatch(setData({ chatId }));
          }
        });
        if (!chatExist) {
          let res = await chats.addIndividualChat(currentUser, props.user, "");
          checkRes(res);
          socket.emit("joinRoom", res.data.insertedId);
          dispatch(
            setData({
              chatId: res.data.insertedId,
              type: constant.chatType.individual,
              users: [currentUser._id, props.user._id],
              enabled: true,
            })
          );
          dispatch(
            addChat({
              _id: res.data.insertedId,
              type: constant.chatType.individual,
              users: [currentUser._id, props.user._id],
              show: true,
            })
          );
        }
        dispatch(setContentStatus(constant.status.content));
      } catch (e) {
        enqueueSnackbar(e, noti.errOpt);
      }
    }
  };

  if (props.user._id) {
    return (
      <Card sx={{ height: "200px", width: "200px", paddingTop:'20px' }}>
        <Grid container alignItems={"stretch"} sx={{ height: "100%" }}>
          <Grid container item xs={12} justifyContent="center">
            <Avatar src={currentUser.avatar}></Avatar>
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <div>name: {props.user.name}</div>
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <SmsIcon onClick={ChatWithUserOrGroup}></SmsIcon>
          </Grid>
        </Grid>
      </Card>
    );
  } else if (props.user.groupId) {
    return (
      <Card sx={{ height: "200px", width: "200px", paddingTop:'20px'}}>
        <Grid container alignItems={"stretch"} sx={{ height: "100%" }}>
          <Grid container item xs={12} justifyContent="center">
            <Avatar>G</Avatar>
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <div>group name: {props.user.groupName}</div>
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <SmsIcon onClick={ChatWithUserOrGroup}></SmsIcon>
          </Grid>
        </Grid>
      </Card>
    );
  } else {
    return <div></div>;
  }
};
