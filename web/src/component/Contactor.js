import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import UserCard from "./UserCard";
import { Avatar } from "@mui/material";

export default function Friends() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userCardData, setUserCardData] = useState(null);
  const curUser = useSelector((state) => state.user);
  const userMap = useSelector((state) => state.chat.users);
  console.log("User friends are ", curUser?.friends);
  const navigate = useNavigate();

  useEffect(() => {
    if (!curUser._id) {
      navigate("/");
    }
  }, []);

  const handleUserClick = (event, friend) => {
    console.log("show or close user card.");
    setAnchorEl(event.currentTarget);
    setUserCardData(friend);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      {curUser.friends?.length > 0 && (
        <div>
          <List>
            {curUser.friends.map((friend) => (
              <ListItem action onClick={(e) => handleUserClick(e, friend)}>
                <Avatar src={userMap[friend._id].avatar}></Avatar>
                {friend.name}
              </ListItem>
            ))}
          </List>
          <List>
            {curUser.groups.map((group) => (
              <ListItem action onClick={(e) => handleUserClick(e, group)}>
                <Avatar>G</Avatar>
                {group.groupName}
              </ListItem>
            ))}
          </List>
          <Popover
            id={id}
            open={open}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
          >
            <UserCard user={userCardData}></UserCard>
          </Popover>
        </div>
      )}
    </div>
  );
}
