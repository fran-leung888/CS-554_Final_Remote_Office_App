import { useSelector, useDispatch } from "react-redux";
import React, { createRef, useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Avatar,
  Fade,
  Button,
  Modal,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import constant from "../../data/constant";
import DownloadIcon from "@mui/icons-material/Download";
import chats from "../../data/chats";
import { checkRes } from "../../utils/verificationUtils";
import { useSnackbar } from "notistack";
import noti from "../../data/notification";
import { downloadFile, getFileObjectUrl } from "../../data/file";
import { burnMessage } from "../../data/redux/chatSlice";
import { Box } from "@mui/system";

export default function MessageItem(props) {
  const message = props.data;
  const curUser = useSelector((state) => state.user);
  const userMap = useSelector((state) => state.chat.users);
  const [showOriginal, setShowOriginal] = useState(false);
  const [burned, setBurned] = useState(false);
  const [expire, setExpire] = useState(false);

  const dispatch = useDispatch();
  console.log("Message Item is ", message);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const readed = useSelector((state) => state.chat.readed);
  useEffect(() => {
    setBurned(readed.includes(message._id));
    if (message.message) {
      try {
        let msgObj = JSON.parse(message.message);
        console.log("Build burn message,", message, msgObj);
        if (msgObj.duration) {
          let min = parseInt(msgObj.duration);
          let start = Date.parse(message.time);
          if (start + min * 1000 * 60 < Date.now()) {
            setExpire(true);
          } else {
            console.log(
              "setTimeout after ",
              (start + min * 1000 * 60 - Date.now()) / 1000
            );
            setTimeout(() => {
              setExpire(true);
            }, start + min * 1000 * 60 - Date.now());
          }
        }
      } catch (e) {
        return;
      }
    }
  });
  const handleBurn = async (e) => {
    // send readed record.
    try {
      if (message.userId !== curUser._id.toString()) {
        let res = await chats.burnMessage(curUser._id, message._id);
        checkRes(res);
        setBurned(true);
        dispatch(burnMessage(res.data));
      }
    } catch (e) {
      enqueueSnackbar(e.toString(), noti.errOpt);
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
    return (burned || expire) && curUser._id !== msg.userId ? (
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

  return (
    <Grid container item justifyContent="flex-start" alignItems="center">
      <Grid item>
        <Avatar
          src={userMap[message.userId].avatar}
          sx={{ width: 24, height: 24 }}
        ></Avatar>
      </Grid>
      <Grid item>{message.loading && <CircularProgress size={14} />}</Grid>
      <Grid item>{message.fail && <PriorityHighIcon size={14} />}</Grid>
      <Grid item sx={{ paddingRight: "20px" }}>
        {message.name}
      </Grid>
      {/* <Grid item>{buildMessage(message)}</Grid> */}
      <Grid item sx={{ paddingRight: "1em" }}>
        {userMap[message.userId].name}
      </Grid>
      <Grid item>{message.time}</Grid>
      <Grid
        sx={{ display: "flex" }}
        conatiner
        item
        xs={12}
        justifyContent="flex-start"
      >
        <div style={{ paddingLeft: "44px" }}>
          {props.data.type && props.data.type === constant.messageType.burn ? (
            buildBurnMsg(message)
          ) : (
            <MessageContent message={message} />
          )}
        </div>
      </Grid>
    </Grid>
  );
}

function DownloadFileButton({ fileMessage }) {
  const file = JSON.parse(fileMessage);

  async function download() {
    await downloadFile({ fileId: file._id, filename: file.originalname });
  }

  return file?.originalname ? (
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
  ) : (
    <div>File Unavilable</div>
  );
}

function MessageContent({ message }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [oriImgUrl, setOriImgUrl] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 1000,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const buildModal = (msg) => {
    if (msg.type === constant.messageType.file) {
      console.log("build Modal");
      const file = JSON.parse(msg.message);
      if (/image*/.test(file.mimetype)) {
        return (
          <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...style }}>
              <img
                style={{ maxHeight: "1000px", maxHeight: "1000px" }}
                src={oriImgUrl}
              />
            </Box>
          </Modal>
        );
      }
    }
    return;
  };

  switch (message.type) {
    case constant.messageType.text:
      return <div>{message.message}</div>;
    case constant.messageType.file:
      const file = JSON.parse(message.message);
      console.debug("file mimetype", file.mimetype);
      if (/image*/.test(file.mimetype)) {
        useEffect(() => {
          getFileObjectUrl(file._id, 100).then(setImgUrl);
          getFileObjectUrl(file._id, null).then(setOriImgUrl);
        }, []);
        return imgUrl ? (
          <div>
            <img onClick={handleOpen} src={imgUrl} />
            {buildModal(message)}
          </div>
        ) : (
          <div>loading...</div>
        );
      }
      return <DownloadFileButton fileMessage={message.message} />;
    default:
      return (
        <Grid item justifyContent="flex-start">
          {message.message}
        </Grid>
      );
  }
}
