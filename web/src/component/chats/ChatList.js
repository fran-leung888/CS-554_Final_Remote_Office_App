import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ChatPre from "./ChatPre";
import chatData from "../../data/chats";
import { setData, setMessages } from "../../data/redux/chatDiagramSlice";
import {
  verifyString,
  checkResult,
  checkRes,
  verifyObj,
} from "../../utils/verificationUtils";
import io from "socket.io-client";

export default function ChatList() {
  const user = useSelector((state) => state.user);
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
            chat._id &&
              socketRef.current.on(
                chatData.getClientChatSocket(chat._id),
                (data) => {
                  console.log("receive message ", data);
                }
              );
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
      const messages = await chatData.getMessages(chat._id);
      dispatch(setData(chat));
      dispatch(setMessages({ messages: messages.data }));
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
