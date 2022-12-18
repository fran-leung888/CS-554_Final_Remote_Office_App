import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";

import React from "react";
import { Navigate } from 'react-router-dom';
import { doSocialSignIn, getCurrentUser } from '../firebase/FirebaseFunctions';
import users from "../data/users";
import { useDispatch } from "react-redux";
import { setUser } from "../data/redux/userSlice";

const SocialSignIn = () => {
    const dispatch = useDispatch();
    const socialSignOn = async (provider) => {

        let user = null;
        try {
            await doSocialSignIn(provider)

            user = await getCurrentUser();
            console.debug("Got social signin user", user);

            const data = await users.addUser(user.displayName, user.uid, null, true);

            if (data.code != 200) {
                throw data
            }

        } catch (error) {
            switch (error.code) {
                case "auth/popup-closed-by-user":
                    console.debug("User closed signin window");
                    break;
                case 400:
                    if (error.msg != "User exists.") {
                        console.error("Got BadRequest:", error);
                    }
                    break;
                default:
                    console.error("Got unknown error:", error);
            }
        }

        if (user) {
            const loginRes = await users.login(user.uid);
            console.debug("Social Account Signed In")
            dispatch(setUser(loginRes.data));
            return <Navigate to='/home' />;
        }
    };
    return (
        <div>
            <FacebookLoginButton onClick={() => socialSignOn('facebook')} />
            <GoogleLoginButton onClick={() => socialSignOn('google')} />
        </div>
    );

};

export default SocialSignIn;