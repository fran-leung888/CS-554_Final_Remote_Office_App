import React from "react";
import { Avatar, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import SearchUser from "./SearchUser";
import { useDispatch } from "react-redux";
import { setContentStatus } from "../data/redux/statusSlice";
import ChatIcon from "@mui/icons-material/Chat";
import { disableDiagram } from "../data/redux/chatDiagramSlice";
export default () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <Avatar></Avatar>
      </Grid>
      <Grid>
        <IconButton
          onClick={() => {
            dispatch(setContentStatus(0));
          }}
        >
          <ChatIcon />
        </IconButton>
      </Grid>
      <Grid>
        <IconButton
          onClick={() => {
            dispatch(setContentStatus(1));
            dispatch(disableDiagram());
          }}
        >
          <PermContactCalendarIcon />
        </IconButton>
      </Grid>
      <Grid>
        <IconButton onClick={handleClickOpen}>
          <SearchIcon />
        </IconButton>
        <SearchUser open={open} handleClose={handleClose} />
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
};
