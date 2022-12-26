import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import users from "../data/users";

export default () => {
  const [showAdd, setShowAdd] = useState(true);
  const curUser = useSelector((state) => state.user);
  // console.log(curUser);

  const searchUser = useSelector((state) => state.searchUser);
  console.log(searchUser);

  if (curUser._id === searchUser._id) {
    return <div>You cannot add yourself~</div>;
  }

  const addFriend = async () => {
    // let firend = await users.updateFriend()
    if (searchUser.friends.length) {
      for (let i = 0; i < searchUser.friends.length; i++) {
        if (searchUser.friends[i]._id === searchUser._id) {
          return <div>this person you already add</div>;
        }
      }
    }
    let add = await users.addFriend(searchUser._id);
    setShowAdd(false);

    console.log(add.data);
  };

  const deleteFriend = async () => {
    let deleteF = await users.deleteFriend(searchUser._id);
    setShowAdd(true);

    console.log(deleteF);
  };

  return (
    <div>
      {showAdd ? (
        <Button onClick={addFriend}>Add</Button>
      ) : (
        <Button onClick={deleteFriend}>Delete</Button>
      )}
    </div>
  );
};
