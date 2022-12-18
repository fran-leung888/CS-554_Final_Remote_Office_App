import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebaseApp from "../firebase/Firebase";
import users from "../data/users";
import { setUser } from "../data/redux/userSlice";

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.user)

    useEffect(() => {
        const signInSocialUser = async socialUser => {
            if (socialUser?.isFirebaseAuth) {
                const loginRes = await users.login(socialUser.uid);
                console.debug("Social Account Auto Signed In")
                dispatch(setUser(loginRes.data));
            }
        };
        firebaseApp.auth().onAuthStateChanged(signInSocialUser);
    }, [user]);

    return <AuthContext.Provider value={{ currentUser: user }}>{children}</AuthContext.Provider>;
};