import React, { useEffect, useRef,useContext } from "react";
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
import { setData } from "../data/redux/messageSlice";
import constant from "../data/constant";
import { SocketContext } from "../socketContext";
export default (props) => {
  console.log("props.user", props.user);
  const currentUser = useSelector((state) => state.user);
  const userChats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext)


  const ChatWithUser = async () => {
    console.log(
      `Add chat from ${currentUser.username} to ${props.user?.username}`
    );
    // send server add chat request and jump to chat diagram.
    try {
      // check if there is a chat between users at local but no message in it
      let chatExist = 0,
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
        }
      });
      if (!chatExist) {
        let res = await chats.addIndividualChat(currentUser, props.user, "");
        checkRes(res);
        socket.emit("joinRoom", res.data.insertedId);
        dispatch(
          setData({
            chatId: res.data.insertedId,
            type: 0,
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
      dispatch(setContentStatus(0));
    } catch (e) {}
  };

  if (props.user._id) {
    return (
      <Card>
        <Avatar></Avatar>
        <SmsIcon onClick={ChatWithUser}></SmsIcon>
      </Card>
    );
  } else {
    return <div></div>;
  }
};
