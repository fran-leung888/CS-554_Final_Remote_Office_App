import React, { useContext } from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Button } from "@mui/material";
import { AuthContext } from './Auth';

const SignOutButton = () => {
    const { currentUser } = useContext(AuthContext);
    return currentUser ? (<Button onClick={ doSignOut }>
        Sign Out {currentUser.displayName}
    </Button>
    ) : "";
};

export default SignOutButton;