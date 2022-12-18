import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress, Avatar, Fade } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { TransitionProps } from "@mui/material/transitions";
import constant from "../../data/constant";

export default function MessageItem(props) {
  const [isHover, setIsHover] = useState(false);
  const message = props.data;
  console.log("Message Item is ", message);
  const handleBurn = (e) => {};

  if ( message.type === constant.messageType.text)
    return (
      <Grid container item>
        <Grid item>
          <Avatar sx={{ width: 24, height: 24 }}></Avatar>
        </Grid>
        <Grid item>{message.loading && <CircularProgress size={14} />}</Grid>
        <Grid item>{message.fail && <PriorityHighIcon size={14} />}</Grid>
        <Grid item>{message.name}</Grid>
        <Grid item>{message.message}</Grid>
        <Grid item>{message.time}</Grid>
      </Grid>
    );

  if (props.data.type && props.data.type === constant.messageType.image)
    return <div></div>;
  if (props.data.type && props.data.type === constant.messageType.burn)
    return (
      <Grid item>
        <LocalFireDepartmentIcon onClick={handleBurn} />
      </Grid>
    );
}
