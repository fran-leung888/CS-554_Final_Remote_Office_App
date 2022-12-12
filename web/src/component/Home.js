import React from "react";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default ({ socket }) => {
  const curUser = useSelector((state) => state.user);
  console.log(curUser);

  useEffect(() => {
    if (curUser) {
      // socket.current = io("http://localhost:3000");
      // socket.current.emit("addUser", curUser._id);
      socket.emit("addUser", curUser._id);
    }
  }, [curUser]);

  const navigate = useNavigate();
  const invite = () => {
    navigate("/invite");
  };

  const friends = () => {
    navigate("/friends");
  };
  return (
    <Grid container>
      <Grid item xs={2}>
        <SideBar></SideBar>
      </Grid>
      <Grid item xs={4}>
        <SideBar></SideBar>
      </Grid>
      <Grid item xs={4}>
        <Button onClick={invite}>Invite</Button>
      </Grid>
      <Grid item xs={4}>
        <Button onClick={friends}>My friends</Button>
      </Grid>
    </Grid>
  );
};