import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import users from "../data/users";
import { setSearchUser } from "../data/redux/searchUser";
import UserCard from "./UserCard";

export default function BasicList(props) {
  console.log(props);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const curUser = useSelector((state) => state.user);

  console.log(curUser);
  if (!curUser._id) {
    return <div>Please Login to Search</div>;
  }

  const searchUser = (user) => {
    dispatch(setSearchUser(user));
    // <UserCard props={user} />;
    navigate(`/search`);
  };
  const buidlUsers = () => {
    return (
      props.users &&
      props.users.map((user) => {
        return (
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => {
                event.preventDefault();
                searchUser(user);
              }}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar}></Avatar>
              </ListItemAvatar>
              <ListItemText>{user.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        );
      })
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List dense={true}>{buidlUsers()}</List>
    </Box>
  );
}
