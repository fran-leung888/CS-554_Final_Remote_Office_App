import React from "react";
import { io } from "socket.io-client";
import users from "../data/users";
import groups from "../data/groups";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import { setUser } from "../data/redux/userSlice";

const UserAdd = ({ socket }) => {
  // const [showInvite, setShowInvite] = useState(false);
  // const [showGroupInvite, setShowGroupInvite] = useState(false);
  const [groupData, setGroupData] = useState(undefined);
  const [accept, setAccept] = useState(false);
  const [reject, setReject] = useState(false);
  const [rejectData, setRejectData] = useState(undefined);
  const [applyUser, setApplyuser] = useState(undefined);
  const dispatch = useDispatch();
  const curUser = useSelector((state) => state.user);
  console.log(curUser);

  //   useEffect(() => {
  //     if (curUser) {
  //       socket.current = io("http://localhost:3000");
  //       socket.current.emit("addUser", curUser._id);
  //     }
  //   }, [curUser]);

  // socket.on("addFriendResponse", (data) => {
  //   console.log(`data`);
  //   console.log(data);
  //   if (data) {
  //     setApplyuser(data);
  //     setShowInvite(true);
  //   } else {
  //     setApplyuser(undefined);
  //     setShowInvite(false);
  //   }
  //   console.log(data);
  // });

  socket.on("agreeResponse", (data) => {
    setRejectData(data);
    console.log(`Agree response: ${data}`);
    if (data && data.applyId && data.applyId === curUser._id) {
      setReject(!data.agree);
    } else {
      setReject(true);
    }
  });

  // socket.on("inviteResponse", (data) => {
  //   setGroupData(data);
  //   console.log("invite response data:");
  //   console.log(groupData);
  //   if (data && data.invite && data.invite._id === curUser._id) {
  //     setShowGroupInvite(true);
  //   } else {
  //     setShowGroupInvite(false);
  //   }
  // });

  const agree = async () => {
    let add = await users.addFriend(applyUser.applyId);
    console.log("add friend:");
    console.log(add);

    socket.emit("agree", {
      agree: true,
      applyId: applyUser.applyId,
      applyUsername: applyUser.applyUsername,
      friendId: applyUser.friendId,
      friendUsername: applyUser.friendUsername,
    });
    // setShowInvite(false);
  };

  const disagree = () => {
    socket.emit("agree", {
      agree: false,
      applyId: applyUser.applyId,
      applyUsername: applyUser.applyUsername,
      friendId: applyUser.friendId,
      friendUsername: applyUser.friendUsername,
    });
  };

  const agreeGroup = async () => {
    const memberId = groupData.invite._id;
    const groupName = groupData.group.groupName;
    let newUser = await groups.addToGroup(memberId, groupName);
    console.log("after accept add to group, update the curUse data:");
    console.log(newUser);
    dispatch(setUser(newUser.data));

    socket.emit("addGroup", {
      agree: true,
      agreeUser: curUser,
      grouper: groupData.invite,
      grouperId: groupData.grouperId,
      group: groupData.group,
    });
    // setShowGroupInvite(false);
  };

  const disagreeGroup = async () => {
    console.log("emit disagree info");
    socket.emit("addGroup", {
      agree: false,
      agreeUser: curUser,
      grouper: groupData.invite,
      grouperId: groupData.grouperId,
      group: groupData.group,
    });
    // setShowGroupInvite(false);
  };

  //   useEffect(() => {
  //     socket.on(
  //       "addFriendResponse",
  //       (data) => {
  //         console.log(data.applyUsername);
  //         if (data && data.applyUsername) {
  //           setApplyuser(data);
  //           setShowInvite(true);
  //         } else {
  //           setApplyuser(undefined);
  //           setShowInvite(false);
  //         }
  //         console.log(data);
  //       },
  //       [curUser]
  //     );

  // socket.on("agreeResponse", (data) => {
  //   setRejectData(data);
  //   if (data && data.applyId && curUser._id === data.applyId) {
  //     setReject(!data.agree);
  //   } else {
  //     setReject(true);
  //   }
  // });
  //   });

  return (
    <div>
      {showInvite ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          {/* <Card className="text-center"> */}
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>{`${applyUser.applyUsername} want to become your friend`}</Modal.Title>
            </Modal.Header>
            {/* <Card.Body> */}
            <Modal.Body>
              <Button variant="primary" onClick={agree}>
                Agree
              </Button>
              <Button variant="primary" onClick={disagree}>
                Disagree
              </Button>
              {/* </Card.Body> */}
            </Modal.Body>
            {/* </Card> */}
          </Modal.Dialog>
        </div>
      ) : (
        ""
      )}
      {showGroupInvite ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>{`${groupData.grouper} want to invite you add ${groupData.group.groupName}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button variant="primary" onClick={agreeGroup}>
                Agree
              </Button>
              <Button variant="primary" onClick={disagreeGroup}>
                Disagree
              </Button>
            </Modal.Body>
          </Modal.Dialog>
        </div>
      ) : (
        ""
      )}
      {reject ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Body>
                <Card.Text>{`${rejectData.friendUsername} reject your invite`}</Card.Text>
              </Modal.Body>
            </Modal.Header>
          </Modal.Dialog>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserAdd;
