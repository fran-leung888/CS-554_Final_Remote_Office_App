import React, { useContext } from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Button } from "@mui/material";
import { AuthContext } from './Auth';
import { useDispatch } from "react-redux";
import { setUser } from "../data/redux/userSlice";

const SignOutButton = () => {
    const dispatch = useDispatch();
    const { currentUser } = useContext(AuthContext);
    const handleSignOut = () => {
        dispatch(setUser({}));
        doSignOut();
        localStorage.clear();
    }
    return currentUser ? (<Button onClick={handleSignOut}>
        Sign Out {currentUser.name}
    </Button>
    ) : "";
};

export default SignOutButton;