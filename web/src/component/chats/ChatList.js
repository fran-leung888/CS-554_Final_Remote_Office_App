import React, { useEffect, useState, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ChatPre from "./ChatPre";
import chatData from "../../data/chats";
import userData from "../../data/users";
import {
  addMessage,
  setAllMessages,
  setMessages,
  setData,
  setInitialized as msgInitialize,
} from "../../data/redux/messageSlice";
import {
  setData as setChatData,
  setUsers,
  setInitialized as chatInitialize,
  addChat,
  showChat,
} from "../../data/redux/chatSlice";
import {
  verifyString,
  checkResult,
  checkRes,
  verifyObj,
} from "../../utils/verificationUtils";
import constant from "../../data/constant";
import { SocketContext } from "../../socketContext";
import "../../App.css";

export default function ChatList() {
  const user = useSelector((state) => state.user);
  const messageSlice = useSelector((state) => state.message);
  const userChats = useSelector((state) => state.chat.chats);
  const chatInit = useSelector((state) => state.chat.initialized);
  const messageInit = useSelector((state) => state.message.initialized);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const currentChatId = messageSlice.chatId;
  const chatDiagramMessages = messageSlice.messages;
  useEffect(() => {
    console.log("socket in chat list", socket);
    socket.on(constant.event.message, (data) => {
      console.log("receive message on message event.", data);
      userChats.forEach((chat) => {
        console.log(chat._id === data.chatId && chat.show === false);
        if (chat._id === data.chatId && chat.show === false)
          dispatch(showChat(chat._id));
      });
      dispatch(
        addMessage({
          chatId: data.chatId,
          messageId: data.messageId,
          userId: data.userId,
          time: data.time,
          message: data.message,
          type: data.type,
        })
      );
    });
    if (Object.getOwnPropertyNames(userChats) !== 0 && chatInit) {
      Object.getOwnPropertyNames(userChats).forEach((chat) => {
        if (userChats[chat]) {
          // request to join room
          console.log("join room", userChats[chat]._id);
          if (userChats[chat]._id) {
            socket.emit("joinRoom", userChats[chat]._id);
          }
          // listen on messages {message,user,time}
        }
      });
    }
    (async () => {
      if (!user?._id) {
        // navigate("/");
      } else {
        if (!messageInit || !chatInit) {
          let res = await chatData.getChats(user._id);

          checkRes(res);
          if (res.data) {
            dispatch(setChatData(res.data.chats));
            dispatch(setAllMessages(res.data.messages));
            res.data.chats.forEach((chat) => {
              if (chat._id) {
                // request to join room
                console.log("join room", chat._id);
                socket.emit("joinRoom", chat._id);
                // listen on messages {message,user,time}
              }
            });
          }

          // get all users
          let userSet = new Set();
          res.data.chats.forEach((chat) => {
            chat.users.forEach((user) => userSet.add(user));
          });
          userSet = Array.from(userSet);
          console.log("Find users ", userSet);
          res = await userData.getUsers(userSet);
          checkRes(res);
          let users = [];
          res.data.forEach((user) => {
            users.push(user);
          });
          dispatch(setUsers(users));
          dispatch(msgInitialize(true));
          dispatch(chatInitialize(true));
        }
      }
    })();
  }, []);

  const handleClickPreview = async (chat) => {
    if (chat._id) {
      dispatch(setData({ ...chat, chatId: chat._id }));
    }
  };

  const buildPreviews = (chats) => {
    return chats
      ? chats.map((chat) => {
          const divStyle = {
            color: "blue",
          };
          console.log("build chat ", chat);
          return chat.show || chatDiagramMessages[chat._id]?.length > 0 ? (
            <div
              className={
                currentChatId !== -1 && currentChatId === chat._id
                  ? "Focus"
                  : ""
              }
              id={chat._id}
              onClick={() => {
                handleClickPreview(chat);
              }}
            >
              <ChatPre data={chat}></ChatPre>
            </div>
          ) : (
            ""
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
