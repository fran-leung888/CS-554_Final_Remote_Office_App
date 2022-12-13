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
// {
//     users:[]
//     messages:[]
//     type: 0
// }
export default function ChatPre(props) {
  console.log("load chat pre ", props.data);
  const [userMap, setUserMap] = useState(null)
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  // Get data at start.
  // get user map for convenience of searching user.
  useEffect(() => {
    try {
      if (!currentUser?._id) navigate("/");
      (async () => {
        let res = await userData.getUsers(props.data.users);
        checkRes(res);
        let users = {};
        res.data.forEach((user) => {
          if (!users[user._id]) {
            users[user._id] = user;
          }
        });
        console.log('user data is' ,users)
        setUserMap(users);
      })();
    } catch (e) {}
  }, []);

  const filterUser = (users) => {
    const filteredOtherUser = users.filter(
      (user) => user != currentUser._id
    );
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

  // for individual and group
  // apply different style
  if (props.data && userMap) {
    return (
      <Grid container>
        <Grid item>
          {/* Avatar */}
          {buildAvatar(props.data)}
        </Grid>
        <Grid item container>
          {/* username */}
          <Grid item xs={12}>
          {buildName(props.data)}
          </Grid>
          <Grid item xc={12} container>
            {/* message */}
            <Grid item></Grid>
            {/* time */}
            <Grid item></Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return <div></div>;
  }
}
