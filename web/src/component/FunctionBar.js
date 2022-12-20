import React from "react";
import { Avatar, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
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
import SignOutButton from "./SignOut";

export default () => {
  const [open, setOpen] = React.useState(false);
  const curUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const invite = () => {
    navigate("/invite");
  };

  const friends = () => {
    navigate("/friends");
  };
  const handleClose = () => {
    setOpen(false);
  };

  const myaccount = () => {
    navigate("/myaccount");
  };

  const inviteFri = () => {
    navigate("/invite");
  };

  const myFriends = () => {
    navigate("/friends");
  };

  console.log(curUser);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <Card
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "1rem",
        }}
      >

        <Card.Text>
          {
            curUser.isFirebaseAuth ? `` : `Username: ${curUser.username}`
          }
        </Card.Text>
        <Card.Text>Name: {curUser.name}</Card.Text>
      </Card>
      <div style={{ padding: "1rem" }}>
        <Button variant="info" onClick={myaccount}>
          My account
        </Button>
      </div>
    </Tooltip>
  );

  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        style={{ paddingBottom: "5rem", paddingTop: "5rem" }}
      >
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400, hide: 1500 }}
          overlay={renderTooltip}
        >
          <Avatar src={curUser.avatar}></Avatar>
        </OverlayTrigger>
      </Grid>
      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        style={{ paddingBottom: "2rem" }}
      >
        <IconButton
          onClick={() => {
            dispatch(setContentStatus(0));
            dispatch(enableDiagram());
          }}
        >
          <ChatIcon />
        </IconButton>
      </Grid>
      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        style={{ paddingBottom: "2rem" }}
      >
        <IconButton>
          <Diversity1Icon onClick={myFriends} />
        </IconButton>
      </Grid>
      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        style={{ paddingBottom: "2rem" }}
      >
        <IconButton>
          <GroupAddIcon onClick={inviteFri} />
        </IconButton>
      </Grid>
      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        style={{ paddingBottom: "2rem" }}
      >
        <IconButton
          onClick={() => {
            dispatch(setContentStatus(1));
            dispatch(disableDiagram());
          }}
        >
          <PermContactCalendarIcon />
        </IconButton>
      </Grid>
      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        style={{ paddingBottom: "2rem" }}
      >
        <IconButton onClick={handleClickOpen}>
          <SearchIcon />
        </IconButton>
      </Grid>
      <Grid>
        <SearchUser open={open} handleClose={handleClose} />
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        <SignOutButton />
      </Grid>
    </Grid>
  );
};
