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
import constant from "../../data/constant";
import { addUsers } from "../../data/redux/chatSlice";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

// {
//     users:[]
//     messages:[]
//     type: 0
// }
export default function ChatPre(props) {
  console.log("load chat pre ", props.data);
  const [init, setInit] = useState(false);
  const currentUser = useSelector((state) => state.user);
  const userMap = useSelector((state) => state.chat.users);
  const messages = useSelector(
    (state) => state.message.messages[props.data._id]
  );
  const dispatch = useDispatch();
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
        if (unknowUsers.length > 0) {
          let res = await userData.getUsers(unknowUsers);
          checkRes(res);
          if (Array.isArray(res.data)) {
            dispatch(addUsers(res.data));
          } else {
            dispatch(addUsers([res.data]));
          }
          console.log("unknown user data is", res.data);
        }
        setInit(true);
      })();
    } catch (e) {
      enqueueSnackbar(e.toString(), noti.errOpt);
    }
  }, []);

  const filterUserId = (users) => {
    const filteredOtherUser = users.filter(
      (user) => user !== currentUser._id.toString()
    );
    console.log("Filtered users are ", filteredOtherUser, currentUser);
    if (filteredOtherUser.length !== 1) throw "Chat is wrong!";
    return filteredOtherUser;
  };

  const buildAvatar = (chat) => {
    console.debug("Build chat pre avatar");
    if (chat?.type === Constant.chatType.group) {
      if (chat.users) {
        const buildForGroup = (users) => {
          let groupAvatars = [];
          for (let i = 0; i < users.length; i++) {
            if (i > Constant.avatarMax) break;
            groupAvatars.push(
              <Grid item xs={4}>
                <Avatar>G</Avatar>
              </Grid>
            );
          }
          return (
            <Grid item xs={4}>
              <Avatar>G</Avatar>
            </Grid>
          );
          return groupAvatars;
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
        const filteredOtherUser = filterUserId(chat.users);

        return (
          <Grid item>
            {userMap[filteredOtherUser]?.avatar ? (
              <Avatar src={userMap[filteredOtherUser].avatar}></Avatar>
            ) : (
              <Avatar></Avatar>
            )}
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
      if (chat.groupName) {
        return (
          // Build avators for the first 9 people
          chat.groupName
        );
      } else {
        return <div>No group name.</div>;
      }
    } else if (chat?.type === Constant.chatType.individual) {
      if (chat.users) {
        const filteredOtherUser = filterUserId(chat.users);
        return userMap[filteredOtherUser]?.name
          ? userMap[filteredOtherUser]?.name
          : "Unknown name";
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
        if (messages.length > 0) {
          lastMessage = messages[messages.length - 1].message;
          const type = messages[messages.length - 1].type;
          console.debug("lastMessage", lastMessage);
          if (type === constant.messageType.burn) {
            return (
              <Grid container item>
                <Grid item xs={2}>
                  <LocalFireDepartmentIcon color="warning" />{" "}
                </Grid>
                <Grid item sx={{ width: "70%" }}>
                  Burn After Reading
                </Grid>
              </Grid>
            );
          } else if (type === constant.messageType.file) {
            const fileInfo = JSON.parse(lastMessage);
            return (
              <div>
                {/image*/.test(fileInfo.mimetype)
                  ? `[image]`
                  : `📂 ${fileInfo.originalname}`}
              </div>
            );
          } else
            return (
              <div>
                {type === constant.messageType.file
                  ? `📂 ${JSON.parse(lastMessage).originalname}`
                  : lastMessage}
              </div>
            );
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
      <Grid container direction={"row"} alignItems="center">
        <Grid item xs={3}>
          {/* Avatar */}
          {buildAvatar(props.data)}
        </Grid>
        <Grid item container xs={9} sx={{ paddingLeft: "10px" }}>
          {/* username */}
          <Grid item xs={12}>
            {buildName(props.data)}
          </Grid>
          <Grid item xc={12} container>
            {/* message */}
            <Grid item className="Wrap-Text">
              {buildMessage(props.data)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return <div></div>;
  }
}
