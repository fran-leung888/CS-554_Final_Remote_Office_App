import React, { useState, useRef } from "react";
import { Grid, CircularProgress, Avatar, Fade } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { uploadFile } from "../../data/file";
import IconButton from "@mui/material/IconButton";
import AttachFile from "@mui/icons-material/AttachFile";
import constant from "../../data/constant";
import { useSelector } from "react-redux";
import { UploadButton } from "../UploadButton";
import { useSnackbar } from "notistack";
import noti from "../../data/notification";

export default function ActionBar(props) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState("");
  const [file, setFile] = React.useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSend = async (event) => {
    if (!file || file.length === 0) {
      enqueueSnackbar("Please select file", noti.errOpt);
      return;
    }
    if (time === "") {
      enqueueSnackbar("Please select time", noti.errOpt);
      return;
    }
    let res = await uploadFile({
      file,
      receiver: props.chatId,
      duration: time,
    });
    props.handleSend(constant.messageType.burn, res.data);
    setOpen(false);
    setTime("");
    setFile(null);
  };
  const handleSetFile = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    setFile(file);
    console.log("Upload file is,", file);
  };

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Set:</DialogTitle>
        <DialogContent>
          <Grid container alignItems={"center"}>
            <Button variant="disabled">
              {file.name ? file.name : "Choose file"}
            </Button>
            <IconButton
              color="primary"
              aria-label="upload file"
              component="label"
            >
              <input hidden type="file" onChange={handleSetFile} />
              <AttachFile />
            </IconButton>
          </Grid>
          <FormControl fullWidth variant="filled">
            <InputLabel id="set-expire">Expire Time</InputLabel>
            <Select
              sx={{ minWidth: "1em" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={time}
              label="Time"
              onChange={handleChange}
            >
              <MenuItem value={1}>One</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>{" "}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{ textTransform: "none" }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container item alignItems={"center"} justifyContent={"center"}>
        <Grid item>
          <Tooltip title="Burn after reading">
            <LocalFireDepartmentIcon
              color="warning"
              onClick={handleClickOpen}
            />
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Send file">
            <div>
              <UploadButton chatId={props.chatId} />
            </div>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
}
