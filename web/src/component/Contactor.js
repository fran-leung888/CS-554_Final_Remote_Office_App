import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import UserCard from "./UserCard";
import { Avatar, Grid } from "@mui/material";

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
          <List
            style={{
              padding: "15px",
            }}
          >
            {curUser.friends.map((friend) => (
              <ListItem action onClick={(e) => handleUserClick(e, friend)}>
                <Grid container direction={"row"} alignItems="center">
                  <Grid item xs={3}>
                    <Avatar src={userMap[friend._id].avatar}></Avatar>
                  </Grid>
                  <Grid item container xs={9} sx={{ paddingLeft: "10px" }}>
                    {/* username */}
                    <Grid item xs={12}>
                      {friend.name}
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <List>
            {curUser.groups.map((group) => (
              <ListItem action onClick={(e) => handleUserClick(e, group)}>
                <Grid container direction={"row"} alignItems="center">
                  <Grid item xs={3}>
                    <Avatar>G</Avatar>
                  </Grid>
                  <Grid item container xs={9} sx={{ paddingLeft: "10px" }}>
                    {/* username */}
                    <Grid item xs={12}>
                      {group.groupName}
                    </Grid>
                  </Grid>
                </Grid>
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
