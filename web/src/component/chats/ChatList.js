import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ChatPre from "./ChatPre";
import chatData from "../../data/chats";
import {
  addMessage,
  setData,
  setMessages,
} from "../../data/redux/chatDiagramSlice";
import {
  verifyString,
  checkResult,
  checkRes,
  verifyObj,
} from "../../utils/verificationUtils";
import io from "socket.io-client";

const messageEvent = "message";

export default function ChatList() {
  const user = useSelector((state) => state.user);
  const chatDiagramMessages = useSelector(
    (state) => state.chatDiagram.messages
  );
  const [userChats, setUserChats] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketRef = useRef();

  const updateMessage = () => {};

  useEffect(() => {
    socketRef.current = io("/");
    (async () => {
      if (!user?._id) {
        console.log("Redirect to logining page.");
        navigate("/");
      } else {
        let res = await chatData.getChats(user._id);
        checkRes(res);
        if (res.data) {
          setUserChats(res.data);
          res.data.forEach((chat) => {
            console.log(`listen on ${chat?._id}`);
            if (chat._id) {
              // request to join room
              console.log('emit join room.')
              socketRef.current.emit("joinRoom", chat._id);
              // listen on messages {message,user,time}
              console.log('listen event')
              socketRef.current.on(messageEvent, (data) => {
                console.log("receive message ", data);
                dispatch(
                  addMessage({
                    _id: chat._id,
                    messageId: data.messageId,
                    user: data.user,
                    time: data.time,
                    message: data.message,
                  })
                );
              });
            }
          });
        }
      }
    })();
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleClickPreview = async (chat) => {
    // click one preview, get and put messages in redux and show diagram .
    try {
      console.log("all messages are ", chatDiagramMessages);
      if (chat._id && chatDiagramMessages[chat._id]) {
        console.log(`Messages exist for ${chat._id}`);
        dispatch(setData(chat));
      } else {
        console.log(`No message exists for ${chat._id}, request for messages.`);
        const messages = await chatData.getMessages(chat._id);
        dispatch(setData(chat));
        dispatch(setMessages({ _id: chat._id, messages: messages.data }));
      }
    } catch (e) {}
  };

  const buildPreviews = (chats) => {
    return chats
      ? chats.map((chat) => {
          return (
            <div
              onClick={() => {
                handleClickPreview(chat);
              }}
            >
              <ChatPre data={chat}></ChatPre>
            </div>
          );
        })
      : [];
  };
  if (userChats.length !== 0) {
    return <div>{buildPreviews(userChats)}</div>;
  } else {
    // No message show no list
    return <div></div>;
  }
  // Find all chats from server and store in redux
  //
}
