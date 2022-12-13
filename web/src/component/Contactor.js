import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import UserCard from "./UserCard";

export default function Friends() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userCardData, setUserCardData] = useState(null);
  const [friendsData, setFriendsData] = useState(undefined);
  const curUser = useSelector((state) => state.user);
  console.log("User friends are ", curUser?.friends);
  const navigate = useNavigate();

  useEffect(() => {
    if (curUser?.friends?.length) {
      setFriendsData(curUser.friends);
    } else {
      setFriendsData([]);
    }
  }, []);
  if (!curUser._id) {
    return <div>Error: please login in</div>;
  }

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
      <List>
        {friendsData &&
          friendsData.map((friend) => (
            <ListItem action onClick={(e) => handleUserClick(e, friend)}>
              {friend.name}
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
  );
}
