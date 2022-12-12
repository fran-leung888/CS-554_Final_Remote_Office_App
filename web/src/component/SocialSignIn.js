import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";

import React from "react";
import{ Navigate } from 'react-router-dom';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';

const SocialSignIn = () => {
    const socialSignOn = async (provider) => {
        try {
            await doSocialSignIn(provider)
            return <Navigate to='/home' />;
        } catch(error) {
            alert(error);
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