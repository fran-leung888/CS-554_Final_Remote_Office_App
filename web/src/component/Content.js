import React from "react";
import { Avatar, Grid } from "@mui/material";

import Contactor from "./Contactor";
import ChatList from "./chats/ChatList";
import { useSelector } from "react-redux";

export default () => {
  const contentStatus = useSelector((state) => state.status.content);

  switch (contentStatus) {
    case 0:
      return <ChatList></ChatList>;
    case 1:
      return <Contactor></Contactor>;
    default:
      return <div></div>;
  }
};
