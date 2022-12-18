import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress, Avatar, Fade, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { TransitionProps } from "@mui/material/transitions";
import constant from "../../data/constant";
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadFile } from "../../data/file";

export default function MessageItem(props) {
  const [isHover, setIsHover] = useState(false);
  const message = props.data;
  console.log("Message Item is ", message);
  const handleBurn = (e) => { };

  if (message.type === constant.messageType.text || message.type === constant.messageType.file)
    return (
      <Grid container item>
        <Grid item>
          <Avatar sx={{ width: 24, height: 24 }}></Avatar>
        </Grid>
        <Grid item>{message.loading && <CircularProgress size={14} />}</Grid>
        <Grid item>{message.fail && <PriorityHighIcon size={14} />}</Grid>
        <Grid item>{message.name}</Grid>
        <Grid item>{message.type === constant.messageType.text ? message.message : <DownloadFileButton fileMessage={message.message} />}</Grid>
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


function DownloadFileButton({ fileMessage }) {
  const file = JSON.parse(fileMessage);

  async function download() {
    await downloadFile({ fileId: file._id, filename: file.originalname });
  }

  return (
    <Button onClick={download} size="small" color="primary" aria-label="download file" component="label">
      {file.originalname}
      <DownloadIcon />
    </Button>
  )
}