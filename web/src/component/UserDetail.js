import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Avatar, Button } from "@mui/material";
import users from "../data/users";
import { setUser } from "../data/redux/userSlice";
// import { io } from "socket.io-client";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

const UserDetail = ({ socket }) => {
  // console.log(`socket: ${socket}`);
  // const [showAdd, setShowAdd] = useState(true);
  const [addSuccess, setAddSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  // const [reject, setReject] = useState(false);
  // const [rejectData, setRejectData] = useState(undefined);
  const [isFriend, setIsFriend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
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
    // console.log(curUser?.friends?.length);
    if (curUser?.friends?.length) {
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

  const myAccount = () => {
    navigate("/myaccount");
  };

  // if (!curUser.name) {
  //   return <div>Please login!</div>;
  // }
  if (curUser._id === searchUser._id) {
    return (
      <div style={{ padding: "100px" }}>
        <Card
          style={{
            width: "500px",
            height: "500px",
            padding: "100px",
          }}
        >
          You cannot choose yourself, please see your detail in "My Account"
          page
          <Button
            onClick={myAccount}
            style={{
              paddingTop: "200px",
              fontFamily: "Verdana, Arial, Helvetica, sans-serif",
            }}
          >
            My Accounting
          </Button>
        </Card>
      </div>
    );
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
    let newCurUser = await users.getUser(curUser._id);
    if (!newCurUser.data) {
      setShowError(true);
    } else {
      setShowError(false);
      console.log("after add friend, update the curUser");
      console.log(newCurUser.data);
      dispatch(setUser(newCurUser.data));
      setShowSuccess(true);
    }
  };

  const deleteFriend = async () => {
    console.log("delete search user");
    console.log(searchUser._id);
    let deleteF = await users.deleteFriend(searchUser._id, curUser?._id?.toString());
    if (!deleteF.data) {
      setShowError(true);
    } else {
      setShowError(false);

      // setShowAdd(true);
      setIsFriend(false);
      setAddSuccess(false);

      console.log(deleteF.data);
    }

    let newCurUser = await users.getUser(curUser._id);
    if (!newCurUser.data) {
      setShowError(true);
    } else {
      setShowError(false);

      console.log("after add friend, update the curUser");
      console.log(newCurUser.data);
      dispatch(setUser(newCurUser.data));
    }
  };
  const closeModal = () => {
    setShowSuccess(false);
  };
  const backHome = () => {
    navigate("/home");
  };
  return (
    <div>
      {showError ? (
        <Error />
      ) : (
        <div
          style={{
            fontFamily: "Verdana, Arial, Helvetica, sans-serif",
          }}
        >
          <Card
            style={{
              width: "500px",
              height: "600px",
              left: "100px",
              top: "100px",
              backgroundColor: "lightblue",
            }}
          >
            <Card.Body>
              <Card.Title style={{ padding: "3rem" }}>
                Username: {searchUser.username}
              </Card.Title>
              <Card.Subtitle
                className="mb-2 text-muted"
                style={{
                  paddingLeft: "3rem",
                  paddingBottom: "7rem",
                  paddingTop: "2rem",
                }}
              >
                Name: {searchUser.name}
              </Card.Subtitle>
              <Card.Text style={{ paddingLeft: "3rem", paddingTop: "150px" }}>
                {isFriend ? (
                  <Button onClick={deleteFriend}>Delete</Button>
                ) : (
                  <Button onClick={addFriend}>Add</Button>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
          {showSuccess ? (
            <div
              className="modal show"
              style={{
                display: "block",
                position: "initial",
              }}
            >
              <Modal.Dialog>
                <Modal.Body
                  style={{
                    backgroundImage:
                      "linear-gradient( 135deg, #C2FFD8 10%, #465EFB 100%)",
                  }}
                >
                  <p>
                    Send success, when he/she agree the invite, you can watch in
                    your friends list!
                  </p>
                </Modal.Body>

                <Modal.Footer
                  style={{
                    backgroundImage:
                      "linear-gradient( 135deg, #C2FFD8 10%, #465EFB 100%)",
                  }}
                >
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </div>
          ) : (
            ""
          )}
          <div style={{ padding: "7rem" }}>
            <Button onClick={backHome}>Back to home</Button>
          </div>

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
      )}
    </div>
  );
};

export default UserDetail;
