import { useSelector, useDispatch } from "react-redux";
import React, { createRef, useEffect, useState } from "react";
import { Grid, CircularProgress, Avatar, Fade, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import constant from "../../data/constant";
import DownloadIcon from "@mui/icons-material/Download";
import chats from "../../data/chats";
import { checkRes } from "../../utils/verificationUtils";
import { useSnackbar } from "notistack";
import noti from "../../data/notification";
import { downloadFile, getFileObjectUrl } from "../../data/file";

export default function MessageItem(props) {
  const message = props.data;
  const curUser = useSelector((state) => state.user);
  const [showOriginal, setShowOriginal] = useState(false);
  const [burned, setBurned] = useState(false);
  const dispatch = useDispatch();
  console.log("Message Item is ", message);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const readed = useSelector((state) => state.chat.readed);
  useEffect(() => {
    setBurned(readed.includes(message._id));
  });
  const handleBurn = async (e) => {
    // send readed record.
    try {
      let res = await chats.burnMessage(curUser._id, message._id);
      checkRes(res);
      setBurned(true);
      dispatch(burnMessage(res.data));
    } catch (e) {
      enqueueSnackbar(e, noti.errOpt);
    }
  };

  const buildMessage = (message) => {
    return message.type === constant.messageType.text ? (
      <div>{message.message}</div>
    ) : (
      <DownloadFileButton fileMessage={message.message} />
    );
  };

  const buildBurnMsg = (msg) => {
    return burned && curUser._id !== msg.userId ? (
      <div>
        <LocalFireDepartmentIcon color="warning" /> Burned{" "}
      </div>
    ) : showOriginal || curUser._id === msg.userId ? (
      <div onClick={handleBurn}>{buildMessage(message)}</div>
    ) : (
      <Button
        onClick={() => {
          setShowOriginal(true);
        }}
      >
        <LocalFireDepartmentIcon color="warning" /> Burn After Reading
      </Button>
    );
  };

  if (
    message.type === constant.messageType.text ||
    message.type === constant.messageType.file
  )
    return (
      <Grid container item>
        <Grid item>
          <Avatar sx={{ width: 24, height: 24 }}></Avatar>
        </Grid>
        <Grid item>{message.loading && <CircularProgress size={14} />}</Grid>
        <Grid item>{message.fail && <PriorityHighIcon size={14} />}</Grid>
        <Grid item>{message.name}</Grid>
        {/* <Grid item>{buildMessage(message)}</Grid> */}
        <Grid item>
          <MessageContent message={message} />
        </Grid>
        <Grid item>{message.time}</Grid>
      </Grid>
    );

  if (props.data.type && props.data.type === constant.messageType.image)
    return <div></div>;
  if (props.data.type && props.data.type === constant.messageType.burn)
    return (
      <Grid container item>
        <Grid item>
          <Avatar sx={{ width: 24, height: 24 }}></Avatar>
        </Grid>
        <Grid item>{buildBurnMsg(message)}</Grid>
      </Grid>
    );
}

function DownloadFileButton({ fileMessage }) {
  const file = JSON.parse(fileMessage);

  async function download() {
    await downloadFile({ fileId: file._id, filename: file.originalname });
  }

  return (
    <Button
      onClick={download}
      size="small"
      color="primary"
      aria-label="download file"
      component="label"
    >
      {file.originalname}
      <DownloadIcon />
    </Button>
  );
}

function MessageContent({ message }) {
  const [imgUrl, setImgUrl] = useState(null);

  switch (message.type) {
    case constant.messageType.text:
      return <div>{message.message}</div>;
    case constant.messageType.file:
      const file = JSON.parse(message.message);
      console.debug("file mimetype", file.mimetype);
      if (/image*/.test(file.mimetype)) {
        useEffect(() => {
          getFileObjectUrl(file._id).then(setImgUrl);
        }, []);
        return imgUrl ? (
          <img width={"100%"} src={imgUrl} />
        ) : (
          <div>loading...</div>
        );
      }
      return <DownloadFileButton fileMessage={message.message} />;
    default:
      return <>{message.message}</>;
  }
}
