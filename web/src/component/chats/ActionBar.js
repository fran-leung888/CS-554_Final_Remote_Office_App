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

export default function ActionBar(props) {
  const [isHover, setIsHover] = useState(false);
  const message = props.data;
  console.log("Message Item is ", message);
  const handleBurn = (e) => {};

  return (
    <Grid container item>
      <Grid item>
        <LocalFireDepartmentIcon />
      </Grid>
    </Grid>
  );
}
