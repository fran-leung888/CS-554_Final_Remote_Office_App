import React from "react";
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

export default (props) => {
  console.log("props.user", props.user);
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const ChatWithUser = async () => {
    console.log(
      `Add chat from ${currentUser.username} to ${props.user?.username}`
    );

    let res = await chats.addIndividualChat(currentUser, props.user, "");
    checkRes(res);
    dispatch(setContentStatus(0));
  };

  return (
    <Card>
      <Avatar></Avatar>
      <SmsIcon onClick={ChatWithUser}></SmsIcon>
    </Card>
  );
};
