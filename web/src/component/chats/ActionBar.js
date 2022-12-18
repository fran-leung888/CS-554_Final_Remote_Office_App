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
import Tooltip from "@mui/material/Tooltip";
import ImageIcon from "@mui/icons-material/Image";
export default function ActionBar(props) {
  const [isHover, setIsHover] = useState(false);
  const message = props.data;
  console.log("Message Item is ", message);
  const handleBurn = (e) => {};

  return (
    <Grid container item>
      <Grid item>
        <Tooltip title="Burn after reading">
          <LocalFireDepartmentIcon color="warning" onClick={() => {}} />
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Send a image">
          <ImageIcon onClick={() => {}} />
        </Tooltip>
      </Grid>
    </Grid>
  );
}
