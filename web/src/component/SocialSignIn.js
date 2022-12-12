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
        <img onClick={() => socialSignOn('google')} alt='google signin' src='/imgs/btn_google_signin.png'></img>
        <img onClick={() => socialSignOn('facebook')} alt='facebook signin' src='/imgs/facebook_signin.png'></img>
        </div>
    );
    
};

export default SocialSignIn;