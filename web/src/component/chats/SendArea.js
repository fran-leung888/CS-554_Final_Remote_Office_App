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
import io from "socket.io-client";
import {
  addLoadingMessage,
  resetLoadingMessage,
} from "../../data/redux/chatDiagramSlice";

export default function SendArea(props) {

  const [messageToSend, setMessageToSend] = useState("");
  const currentUser = useSelector((state) => state.user);
  const _id = useSelector(state => state.chatDiagram._id)
  const dispatch = useDispatch();
  const socketRef = useRef();

  useEffect(() => {
    console.log('initial render.')
    socketRef.current = io("/");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // const handleSend = async () => {
  //   try {
  //     if (socketRef.current.connected) {
  //       socketRef.current.timeout(5000).emit(
  //         chatData.getServerChatSocket(props.chat),
  //         {
  //           message: messageToSend,
  //           user: currentUser,
  //         },
  //         (err, response) => {
  //           if (err) {
  //             console.log(err);
  //             throw "Send message failed!";
  //           } else {
  //             console.log("Add message response", response);
  //             // TODO success remove loading message.
  //           }
  //         }
  //       );
  //       setMessageToSend("");
  //     } else {
  //       throw "Socket connection error.";
  //     }
  //   } catch (e) {}
  // };

  const handleSend = async () => {
    try {
      // add message to redux and set it as loading
      if (!verifyString(messageToSend).valid) throw "Message can not be empty.";
      let randomId = Math.random();
      dispatch(
        addLoadingMessage({
          randomId,
          message: messageToSend,
          user: currentUser,
        })
      );
      let res = await chatData.sendMessage(
        _id,
        messageToSend,
        currentUser
      );
      checkRes(res);
      dispatch(
        resetLoadingMessage({
          randomId,
          realId: res.data.insertedIds[0],
        })
      );
      setMessageToSend('')
    } catch (e) {}
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl>
          <TextField
            placeholder="Type your message here."
            value={messageToSend}
            onChange={(e) => {
              setMessageToSend(e.target.value)
            }}
          ></TextField>
        </FormControl>
      </Grid>
      <Grid item>
        <Button onClick={handleSend}>Send</Button>
      </Grid>
    </Grid>
  );
}
