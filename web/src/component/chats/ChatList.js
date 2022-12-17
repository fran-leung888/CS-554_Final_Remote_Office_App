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

export default function ChatList() {
  const user = useSelector((state) => state.user);
  const chatDiagramMessages = useSelector((state) => state.message.messages);
  const userChats = useSelector((state) => state.chat.chats);
  const chatInit = useSelector((state) => state.chat.initialized);
  const messageInit = useSelector((state) => state.message.initialized);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const updateMessage = () => {};

  useEffect(() => {
    console.log("socket in chat list", socket);
    socket.on(constant.event.message, (data) => {
      console.log("receive message on message event.", data);
      userChats.forEach((chat) => {
        console.log(chat._id === data.chatId && chat.show === false)
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
        })
      );
    });
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
    // click one preview, get and put messages in redux and show diagram .
    // try {
    //   console.log("all messages are ", chatDiagramMessages);
    //   if (chat._id && chatDiagramMessages[chat._id]) {
    //     console.log(`Messages exist for ${chat._id}`);
    //     dispatch(setData(chat));
    //   } else {
    //     console.log(`No message exists for ${chat._id}, request for messages.`);
    //     const messages = await chatData.getMessages(chat._id);
    //     dispatch(setData(chat));
    //     dispatch(setMessages({ _id: chat._id, messages: messages.data }));
    //   }
    // } catch (e) {}

    if (chat._id) {
      dispatch(setData({ ...chat, chatId: chat._id }));
    }
  };

  const buildPreviews = (chats) => {
    return chats
      ? chats.map((chat) => {
          console.log("build chat ", chat);
          return chat.show || chatDiagramMessages[chat._id]?.length > 0 ? (
            <div
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
