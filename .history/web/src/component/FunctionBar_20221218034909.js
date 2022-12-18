import React from "react";
import { Avatar, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import SearchUser from "./SearchUser";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setContentStatus } from "../data/redux/statusSlice";
import ChatIcon from "@mui/icons-material/Chat";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { disableDiagram, enableDiagram } from "../data/redux/messageSlice";
export default () => {
  const [open, setOpen] = React.useState(false);
  const curUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const myaccount = () => {
    navigate("/myaccount");
  };

  console.log(curUser);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <Card.Text>Username: {curUser.username}</Card.Text>
      <Card.Text>name: {curUser.name}</Card.Text>
      <Button variant="primary" onClick={myaccount}>
        My account
      </Button>
    </Tooltip>
  );

  return (
    <Grid container direction="column">
      <Grid item>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <Avatar></Avatar>
        </OverlayTrigger>
      </Grid>
      <Grid>
        <IconButton
          onClick={() => {
            dispatch(setContentStatus(0));
            dispatch(enableDiagram());
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
