import React from "react";
import { io } from "socket.io-client";
import users from "../data/users";
import groups from "../data/groups";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
// import Container from "react-bootstrap/Container";
// import Modal from "react-bootstrap/Modal";
// import Form from "react-bootstrap/Form";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import { setUser } from "../data/redux/userSlice";

const UserAdd = ({ socket }) => {
  const [offlineInvite, setOfflineInvite] = useState([]);
  const [offlineGroupInvite, setOfflineGroupInvite] = useState([]);
  // const [showInvite, setShowInvite] = useState(false);
  // const [showGroupInvite, setShowGroupInvite] = useState(false);
  // const [groupData, setGroupData] = useState(undefined);
  // const [accept, setAccept] = useState(false);
  // const [reject, setReject] = useState(false);
  // const [rejectData, setRejectData] = useState(undefined);
  // const [applyUser, setApplyuser] = useState(undefined);
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

  // socket.on("agreeResponse", (data) => {
  //   setRejectData(data);
  //   console.log(`Agree response: ${data}`);
  //   if (data && data.applyId && data.applyId === curUser._id) {
  //     setReject(!data.agree);
  //   } else {
  //     setReject(true);
  //   }
  // });

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

  // const agree = async () => {
  //   let add = await users.addFriend(applyUser.applyId);
  //   console.log("add friend:");
  //   console.log(add);

  //   socket.emit("agree", {
  //     agree: true,
  //     applyId: applyUser.applyId,
  //     applyUsername: applyUser.applyUsername,
  //     friendId: applyUser.friendId,
  //     friendUsername: applyUser.friendUsername,
  //   });
  // setShowInvite(false);
  // };

  // const disagree = () => {
  //   socket.emit("agree", {
  //     agree: false,
  //     applyId: applyUser.applyId,
  //     applyUsername: applyUser.applyUsername,
  //     friendId: applyUser.friendId,
  //     friendUsername: applyUser.friendUsername,
  //   });
  // };

  // const agreeGroup = async () => {
  //   const memberId = groupData.invite._id;
  //   const groupName = groupData.group.groupName;
  //   let newUser = await groups.addToGroup(memberId, groupName);
  //   console.log("after accept add to group, update the curUse data:");
  //   console.log(newUser);
  //   dispatch(setUser(newUser.data));

  //   socket.emit("addGroup", {
  //     agree: true,
  //     agreeUser: curUser,
  //     grouper: groupData.invite,
  //     grouperId: groupData.grouperId,
  //     group: groupData.group,
  //   });
  //   // setShowGroupInvite(false);
  // };

  // const disagreeGroup = async () => {
  //   console.log("emit disagree info");
  //   socket.emit("addGroup", {
  //     agree: false,
  //     agreeUser: curUser,
  //     grouper: groupData.invite,
  //     grouperId: groupData.grouperId,
  //     group: groupData.group,
  //   });
  //   // setShowGroupInvite(false);
  // };

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

  useEffect(() => {
    console.log(curUser);
    console.log(curUser.offlineInvite);
    console.log(curUser.offlineGroupInvite);
    if (curUser && curUser.offlineInvite) {
      setOfflineInvite(curUser.offlineInvite);
    } else if (curUser && !curUser.offlineInvite) {
      setOfflineInvite([]);
    }
    if (curUser && curUser.offlineGroupInvite) {
      setOfflineGroupInvite(curUser.offlineGroupInvite);
    } else if (curUser && !curUser.offlineGroupInvite) {
      setOfflineGroupInvite([]);
    }
  }, [curUser, curUser.offlineInvite, curUser.offlineGroupInvite]);

  const agree = async (single, e) => {
    console.log("agree be friend");
    console.log(single);

    await users.addFriend(single.inviteUserId);
    // await dispatch(setUser(newCurUser.data));

    const newCurUser = await users.delFriRecord(
      curUser._id,
      single.inviteUserId
    );
    dispatch(setUser(newCurUser.data));
      
    // if (newCurUser.data) {
    //   let temp = [];
    //   for (let i = 0; i < offlineInvite.length; i++) {
    //     if (offlineInvite[i].inviteUserId !== single.inviteUserId) {
    //       temp.push(offlineInvite[i].inviteUserId);
    //     }
    //   }
    //   setOfflineInvite(temp);
    // }
  };

  const disagree = async (single, e) => {
    console.log("disagree be friend");
    console.log(single);

    // let temp = [];
    // for (let i = 0; i < offlineInvite.length; i++) {
    //   if (offlineInvite[i].inviteUserId !== single.inviteUserId) {
    //     temp.push(offlineInvite[i].inviteUserId);
    //   }
    // }
    const newCurUser = await users.delFriRecord(
      curUser._id,
      single.inviteUserId
    );
    dispatch(setUser(newCurUser.data));
    return <div>Success disagree</div>;
  };

  const agreeGroup = async (single, e) => {
    // userId, inviteUserId, attendGroupId
    console.log("agree add in group");
    console.log(single);

    await groups.addToGroup(curUser._id, single.attendGroupName);

    const newCurUser = await users.delGroupRecord(
      curUser._id,
      single.inviteUserId
    );
    dispatch(setUser(newCurUser.data));

    // if (newCurUser.data) {
    //   let temp = [];
    //   for (let i = 0; i < offlineGroupInvite.length; i++) {
    //     if (offlineGroupInvite[i].inviteUserId !== single.inviteUserId) {
    //       temp.push(offlineGroupInvite[i].inviteUserId);
    //     } else {
    //       let del = offlineGroupInvite[i].inviteUserId;
    //     }
    //   }
    //   setOfflineGroupInvite(temp);
    // }
  };

  const disagreeGroup = async (single, e) => {
    console.log("disagree add in group");
    console.log(single);
    // let temp = [];
    // for (let i = 0; i < offlineGroupInvite.length; i++) {
    //   if (offlineGroupInvite[i].inviteUserId !== single.inviteUserId) {
    //     temp.push(offlineGroupInvite[i].inviteUserId);
    //   }
    // }
    // setOfflineGroupInvite(temp);
    const newCurUser = await users.delGroupRecord(
      curUser._id,
      single.inviteUserId
    );
    console.log(newCurUser.data);
    dispatch(setUser(newCurUser.data));

    return <div>Success disagree</div>;
  };

  console.log(curUser);
  console.log(offlineInvite);
  console.log(offlineGroupInvite);
  return (
    <div>
      <ListGroup>
        {offlineInvite.length ? (
          offlineInvite.map((single) => (
            <ListGroup.Item>
              {single.inviteUsername} want to become your friend
              <Button onClick={(e) => agree(single, e)}>Agree</Button>
              <Button onClick={(e) => disagree(single, e)}>Disagree</Button>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No friend invite message</ListGroup.Item>
        )}
      </ListGroup>

      <ListGroup>
        {offlineGroupInvite.length ? (
          offlineGroupInvite.map((single) => (
            <ListGroup.Item>
              {single.inviteUsername} want to invite you add in{" "}
              {single.attendGroupName}
              <Button onClick={(e) => agreeGroup(single, e)}>Agree</Button>
              <Button onClick={(e) => disagreeGroup(single)}>Disagree</Button>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No group invite message</ListGroup.Item>
        )}
      </ListGroup>
    </div>
    //</div>{showInvite ? (
    //     <div
    //       className="modal show"
    //       style={{ display: "block", position: "initial" }}
    //     >
    //       {/* <Card className="text-center"> */}
    //       <Modal.Dialog>
    //         <Modal.Header closeButton>
    //           <Modal.Title>{`${applyUser.applyUsername} want to become your friend`}</Modal.Title>
    //         </Modal.Header>
    //         {/* <Card.Body> */}
    //         <Modal.Body>
    //           <Button variant="primary" onClick={agree}>
    //             Agree
    //           </Button>
    //           <Button variant="primary" onClick={disagree}>
    //             Disagree
    //           </Button>
    //           {/* </Card.Body> */}
    //         </Modal.Body>
    //         {/* </Card> */}
    //       </Modal.Dialog>
    //     </div>
    //   ) : (
    //     ""
    //   )}
    //   {showGroupInvite ? (
    //     <div
    //       className="modal show"
    //       style={{ display: "block", position: "initial" }}
    //     >
    //       <Modal.Dialog>
    //         <Modal.Header closeButton>
    //           <Modal.Title>{`${groupData.grouper} want to invite you add ${groupData.group.groupName}`}</Modal.Title>
    //         </Modal.Header>
    //         <Modal.Body>
    //           <Button variant="primary" onClick={agreeGroup}>
    //             Agree
    //           </Button>
    //           <Button variant="primary" onClick={disagreeGroup}>
    //             Disagree
    //           </Button>
    //         </Modal.Body>
    //       </Modal.Dialog>
    //     </div>
    //   ) : (
    //     ""
    //   )}
    //   {reject ? (
    //     <div
    //       className="modal show"
    //       style={{ display: "block", position: "initial" }}
    //     >
    //       <Modal.Dialog>
    //         <Modal.Header closeButton>
    //           <Modal.Body>
    //             <Card.Text>{`${rejectData.friendUsername} reject your invite`}</Card.Text>
    //           </Modal.Body>
    //         </Modal.Header>
    //       </Modal.Dialog>
    //     </div>
    //   ) : (
    //     ""
    //   )}
    // </div>
  );
};

export default UserAdd;
