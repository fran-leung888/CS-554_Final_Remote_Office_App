import React, { useContext } from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Button } from "@mui/material";
import { AuthContext } from "./Auth";
import { useDispatch } from "react-redux";
import { setUser } from "../data/redux/userSlice";
import { reset as chatReset } from "../data/redux/chatSlice";
import { reset as messageReset } from "../data/redux/messageSlice";
import { reset as statusReset } from "../data/redux/statusSlice";
import { reset as userReset } from "../data/redux/userSlice";
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from "@mui/material/IconButton";


const SignOutButton = () => {
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const handleSignOut = () => {
    dispatch(setUser({}));
    dispatch(chatReset());
    dispatch(messageReset());
    dispatch(statusReset());
    doSignOut();
    localStorage.clear();
  };
  return currentUser ? (
    <IconButton onClick={handleSignOut}>
      <LogoutIcon />
    </IconButton>
    
    // <Button onClick={handleSignOut}>
    //   {/* Sign Out {currentUser.name} */}
    // </Button>
  ) : (
    ""
  );
};

export default SignOutButton;
