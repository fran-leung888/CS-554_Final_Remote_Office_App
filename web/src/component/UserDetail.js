import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import users from "../data/users";
// import { io } from "socket.io-client";
// import Card from "react-bootstrap/Card";

const UserDetail = ({ socket }) => {
  // console.log(`socket: ${socket}`);
  // const [showAdd, setShowAdd] = useState(true);
  const [addSuccess, setAddSuccess] = useState(false);
  // const [reject, setReject] = useState(false);
  // const [rejectData, setRejectData] = useState(undefined);
  const [isFriend, setIsFriend] = useState(false);

  const navigate = useNavigate();

  const curUser = useSelector((state) => state.user);
  console.log(`curUser: ${JSON.stringify(curUser)}`);

  const searchUser = useSelector((state) => state.searchUser);
  console.log(`searchUser: ${JSON.stringify(searchUser)}`);

  // useEffect(() => {
  //   if (curUser) {
  //     socket.current = io("http://localhost:3000");
  //     socket.current.emit("addUser", curUser._id);
  //   }
  // }, [curUser]);

  useEffect(() => {
    console.log(curUser.friends.length);
    if (curUser.friends.length) {
      let temp = false;
      console.log(curUser.friends);
      for (let i = 0; i < curUser.friends.length; i++) {
        console.log(`curUser.friends[i]._id: ${curUser.friends[i]._id}`);
        console.log(`searchUser._id: ${searchUser._id}`);
        if (curUser.friends[i]._id === searchUser._id) {
          console.log("already have this friend");
          temp = true;
          setIsFriend(true);
        }
      }
      if (!temp) setIsFriend(false);
    } else {
      setIsFriend(false);
    }

    console.log(isFriend);
  }, []);

  if (!curUser.name) {
    return <div>Please login!</div>;
  }
  if (curUser._id === searchUser._id) {
    return <div>You cannot choose yourself~</div>;
  }

  const addFriend = async () => {
    // let firend = await users.updateFriend()
    // if (searchUser.friends.length) {
    //   for (let i = 0; i < searchUser.friends.length; i++) {
    //     if (searchUser.friends[i]._id === searchUser._id) {
    //       return <div>this person you already add</div>;
    //     }
    //   }
    // }

    socket.emit("addFriend", {
      applyId: curUser._id,
      applyName: curUser.name,
      applyUsername: curUser.username,
      friendId: searchUser._id,
      friendName: searchUser.name,
      friendUsername: searchUser.username,
    });

    // socket.on("agreeResponse", (data) => {
    //   console.log(`Agree response: ${data}`);
    //   if (data && data.applyId) {
    //     setReject(!data.agree);
    //     setRejectData(undefined);
    //   } else {
    //     setRejectData(data);
    //     setReject(true);
    //   }
    // });

    // socket.on("addFriendResponse", (data) => {
    //   console.log(data.username);
    //   if (data.username) {
    //     setAddSuccess(true);
    //   } else {
    //     setAddSuccess(false);
    //   }
    //   console.log(data);
    // });

    // if (addSuccess) {
    //   console.log("add success");
    //   let add = await users.addFriend(searchUser._id);
    //   setShowAdd(false);
    //   console.log(add.data);
    // } else {
    //   console.log("add unsuccessful");
    // }
    navigate("/login");
  };

  const deleteFriend = async () => {
    console.log("delete search user");
    console.log(searchUser._id);
    let deleteF = await users.deleteFriend(searchUser._id);
    // setShowAdd(true);
    setIsFriend(false);
    setAddSuccess(false);

    console.log(deleteF.data);
  };

  return (
    <div>
      {isFriend ? (
        <Button onClick={deleteFriend}>Delete</Button>
      ) : (
        <Button onClick={addFriend}>Add</Button>
      )}

      {/* {reject ? (
        <Card className="text-center">
          <Card.Body>
            <Card.Text>{`${rejectData.friendUsername}reject your invite`}</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <div></div>
      )} */}
    </div>
  );
};

export default UserDetail;
