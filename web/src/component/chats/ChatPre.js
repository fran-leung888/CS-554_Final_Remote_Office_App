import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Avatar from "@mui/material/Avatar";
import userData from "../../data/users";
import { Grid } from "@mui/material";
import {
  verifyString,
  checkResult,
  checkRes,
  verifyObj,
} from "../../utils/verificationUtils";
import Constant from "../../data/constant";
import { useSnackbar } from "notistack";
import noti from "../../data/notification";
// {
//     users:[]
//     messages:[]
//     type: 0
// }
export default function ChatPre(props) {
  console.log("load chat pre ", props.data);
  const [init, setInit] = useState(false)
  const currentUser = useSelector((state) => state.user);
  const userMap = useSelector((state) => state.chat.users);
  const messages = useSelector(
    (state) => state.message.messages[props.data._id]
  );
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Get data at start.
  // get user map for convenience of searching user.
  useEffect(() => {
    try {
      // if (!currentUser?._id) navigate("/");
      (async () => {
        const unknowUsers = [];
        props.data.users.forEach((user) => {
          if (!userMap[user]) unknowUsers.push(user);
        });
        if(unknowUsers.length > 0){
          let res = await userData.getUsers(unknowUsers);
          checkRes(res);
          let users = {};
          res.data.forEach((user) => {
            if (!users[user._id]) {
              users[user._id] = user;
            }
          });
          console.log("unknown user data is", users);
        }
        setInit(true)
      })();
    } catch (e) {
      enqueueSnackbar(e, noti.errOpt);
    }
  }, []);

  const filterUser = (users) => {
    const filteredOtherUser = users.filter((user) => user != currentUser._id);
    if (filteredOtherUser.length !== 1) throw "Chat is wrong!";
    return filteredOtherUser;
  };

  const buildAvatar = (chat) => {
    if (chat?.type === Constant.chatType.group) {
      if (chat.users) {
        const buildForGroup = (users) => {
          let groupAvatars = [];
          for (let i = 0; i < users.length; i++) {
            if (i > Constant.avatarMax) break;
            groupAvatars.push(
              <Grid item xs={4}>
                <Avatar></Avatar>
              </Grid>
            );
          }
        };
        return (
          // Build avators for the first 9 people
          <Grid container>{buildForGroup(chat.users)}</Grid>
        );
      } else {
        return <div>No users.</div>;
      }
    } else if (chat?.type === Constant.chatType.individual) {
      if (chat.users) {
        const filteredOtherUser = filterUser(chat.users);
        return (
          <Grid item>
            <Avatar></Avatar>
          </Grid>
        );
      } else {
        return <div>No users.</div>;
      }
    } else {
      return <div>No users.</div>;
    }
  };

  const buildName = (chat) => {
    if (chat?.type === Constant.chatType.group) {
      if (chat.name) {
        return (
          // Build avators for the first 9 people
          chat.name
        );
      } else {
        return <div>No group name.</div>;
      }
    } else if (chat?.type === Constant.chatType.individual) {
      if (chat.users) {
        const filteredOtherUser = filterUser(chat.users);
        return userMap[filteredOtherUser].name;
      } else {
        return;
      }
    }
  };

  const buildMessage = (chat) => {
    if (chat && chat._id) {
      // get last message
      if (messages) {
        let lastMessage = "";
        const me = "";
        if (messages.length > 0) {
          lastMessage = messages[messages.length - 1].message;
          return <div>{lastMessage}</div>;
        }
      }
    } else {
      return <div></div>;
    }
  };

  // for individual and group
  // apply different style
  if (props.data && init) {
    return (
      <Grid container direction={"row"}>
        <Grid item xs={3}>
          {/* Avatar */}
          {buildAvatar(props.data)}
        </Grid>
        <Grid item container xs={9}>
          {/* username */}
          <Grid item xs={12}>
            {buildName(props.data)}
          </Grid>
          <Grid item xc={12} container>
            {/* message */}
            <Grid item>{buildMessage(props.data)}</Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return <div></div>;
  }
}
