import React from "react";
import SignOutButton from "./SignOut";
import ChangePassword from './ChangePassword';

function Account() {
    return (
        <div>
            <h2>Account page</h2>
            <ChangePassword />
            <SignOutButton />
        </div>
    );
}

export default Account;