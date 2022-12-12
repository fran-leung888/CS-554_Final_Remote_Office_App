import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import UserList from "./UserLists";

import users from "../data/users";

import {
  verifyString,
  checkResult,
  checkRes,
  verifyObj,
} from "../utils/verificationUtils";

import { useDispatch } from "react-redux";
import { setError } from "../data/redux/errorSlice";

export default function FormDialog(props) {
  const [name, setName] = useState("");
  const [openUsers, setOpenUsers] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const dispatch = useDispatch();

  const searchUser = async () => {
    try {
      checkResult(verifyString(name));
      let res = await users.searchUser(name);
      console.log(res);
      checkRes(res);
      checkResult(verifyObj(res.data, "user"));
      setSearchResult([...res.data]);
      setOpenUsers(true);
    } catch (e) {
      dispatch(
        setError({
          status: true,
          description: e,
        })
      );
    }
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Search</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="email"
          fullWidth
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={searchUser}>Go</Button>
      </DialogActions>
      <Dialog
        open={openUsers}
        onClose={() => {
          setOpenUsers(false);
        }}
      >
        <DialogTitle>Search Result</DialogTitle>
        <DialogContent>
          <UserList users={searchResult} />
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}