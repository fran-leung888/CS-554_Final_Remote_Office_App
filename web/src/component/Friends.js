import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { checkResult, verifyString } from "../utils/verificationUtils";

import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import users from "../data/users";
import groups from "../data/groups";
import { setUser } from "../data/redux/userSlice";

export default function Friends({ socket }) {
  const [hasFriend, setHasFriend] = useState(false);
  const [friendsData, setFriendsData] = useState(undefined);
  const [hasGroups, setHasGroups] = useState(false);
  const [groupsData, setGroupsData] = useState(undefined);
  const [groupName, setGroupName] = useState("");
  const [curGroup, setCurGroup] = useState({});
  const [show, setShow] = useState(false);
  const [inviteShow, setInviteShow] = useState(false);
  const [agreeAdd, setAgreeAdd] = useState(false);
  const [showRespond, setShowRespond] = useState(false);
  const [responseData, setResponseData] = useState(undefined);
  const [respondShow, setRespondShow] = useState(false);

  const [groupsSet, setGroupsSet] = useState([]);
  //   const [deleteSuccess, setDeleteSuccess] = useState(false);
  const curUser = useSelector((state) => state.user);
  console.log(`curUser: ${JSON.stringify(curUser)}`);

  const dispatch = useDispatch();

  useEffect(() => {
    if (curUser && curUser.friends) {
      if (curUser.friends.length) {
        console.log("in");
        setHasFriend(true);
        setFriendsData(curUser.friends);
      } else {
        setHasFriend(false);
        setFriendsData(undefined);
      }

      if (curUser.groups.length) {
        setHasGroups(true);
        setGroupsData(curUser.groups);
        console.log("current groups:");
        console.log(curUser.groups);
      } else {
        setHasGroups(false);
        setGroupsData(undefined);
      }
    }
  }, [curUser, curUser.friends]);
  // if (!curUser._id) {
  //   return <div>Error: please login in</div>;
  // }

  async function tryGroup(groupsData) {
    console.log(groupsData);
    console.log(curGroup);
    let haveMembers = {};
    for (let i = 0; i < groupsData.length; i++) {
      console.log(groupsData[i].groupName);
      if (groupsData[i].groupName) {
        console.log("in  groupsData[i].groupName");
        console.log(groupsData[i].groupName);
        let tempGroup = await groups.getByName(groupsData[i].groupName);
        console.log(tempGroup.data.groupMembers);

        if (tempGroup.data.groupMembers.length) {
          for (let j = 0; j < tempGroup.data.groupMembers.length; j++) {
            if (!haveMembers[groupsData[i].groupName]) {
              haveMembers[groupsData[i].groupName] = new Set();
              if (tempGroup.data.groupMembers[j].memberName) {
                haveMembers[groupsData[i].groupName].add(
                  tempGroup.data.groupMembers[j].memberName
                );
              }
            } else {
              console.log(haveMembers[groupsData[i].groupName]);
              if (tempGroup.data.groupMembers[j].memberName)
                haveMembers[groupsData[i].groupName].add(
                  tempGroup.data.groupMembers[j].memberName
                );

              console.log(haveMembers[groupsData[i].groupName]);
            }
          }
        } else {
          haveMembers[groupsData[i].groupName] = new Set();
        }
        console.log(tempGroup);
      }
    }
    console.log(curGroup.groupName);
    console.log(haveMembers);
    // if (curGroup.groupName && haveMembers[curGroup.groupName].length)
    //   console.log(haveMembers[curGroup.groupName].has("user4"));
    setGroupsSet(haveMembers);
  }
  useEffect(() => {
    console.log("in this effect, call tryGroup");
    if (groupsData) tryGroup(groupsData);
  }, [groupsData]);

  useEffect(() => {
    // console.log("in this effect, call tryGroup");
    if (curUser.groups) {
      setGroupsData(curUser.groups);
    } else {
      setGroupsSet(undefined);
    }
    console.log(groupsData);
    console.log(curGroup);
    // if (groupsData) tryGroup(groupsData);
    // else setResponseData(undefined);
  }, [curGroup, curUser.groups]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInviteClose = () => setInviteShow(false);
  const handleInviteShow = (group) => {
    console.log(group);
    if (group) setCurGroup(group);
    setInviteShow(true);
  };

  const handleRespondClose = () => setRespondShow(false);

  const deleteFri = async (friend, e) => {
    console.log(friend);
    if (friend._id) {
      let deleteF = await users.deleteFriend(friend._id);
      let newUser = await users.getUser(curUser._id);
      dispatch(setUser(newUser.data));
      setGroupsData(curUser.groups);
      console.log(deleteF);
    }
  };

  const deleteGro = async (group, e) => {
    console.log(group);
    if (group.groupId) {
      let exitG = await groups.exit(curUser._id, group.groupId);
      console.log(exitG.data);
      dispatch(setUser(exitG.data));
      setGroupsData(curUser.groups);
      // navigate("/home");
    }
  };

  const createGroup = async () => {
    checkResult(verifyString(groupName));
    let newUser = await groups.createGroups(groupName);
    console.log(newUser.data);
    dispatch(setUser(newUser.data));
    setShow(false);
  };

  const kick = async (friend) => {
    // console.log(friend);
    // console.log(curGroup);
    // console.log(groupsSet);

    if (groupsSet[curGroup.groupName].has(friend.username)) {
      let newFriend = await groups.exit(friend._id, curGroup.groupId);
      console.log("after delete this one:");
      console.log(newFriend.data);
      // curGroup
      let newGroup = await groups.getByName(curGroup.groupName);
      setCurGroup(newGroup.data);
      let newCurUser = await users.getUser(curUser._id);
      console.log("curUser data:");
      console.log(newCurUser.data);
      dispatch(setUser(newCurUser.data));
      setGroupsData(newCurUser.data.groups);
      tryGroup(groupsData);
    }

    console.log(curGroup);
    console.log(groupsData);
  };

  const invite = async (friend, e) => {
    /*Need use socket.io to achieve invite other users add in this group */
    console.log(friend);
    console.log(curGroup);
    socket.emit("invite", {
      grouper: curUser.username,
      grouperId: curUser._id,
      invite: friend,
      group: curGroup,
    });
    setInviteShow(false);
    if (responseData && agreeAdd) setRespondShow(true);
    else setRespondShow(false);
  };

  const updateGroup = async () => {
    console.log("update group data after add a pople in");
    const newGroup = await groups.getByName(curGroup.groupName);
    setCurGroup(newGroup.data);
  };

  socket.on("addGroupRespond", (data) => {
    setResponseData(data);
    console.log("got the info which if this friend agree or not agree add in");
    console.log(data);
    if (data.agree) {
      setAgreeAdd(true);
      if (curGroup) {
        updateGroup();
      }
    } else setAgreeAdd(false);
  });

  async function resetCurUser() {
    let newUser = await users.getUser(curUser._id);
    console.log("after agree add in group, fresh the curUser data:");
    console.log(newUser.data);
    dispatch(setUser(newUser.data));
    setGroupsData(curUser.groups);
  }
  useEffect(() => {
    if (agreeAdd) {
      resetCurUser();
    }
  }, [agreeAdd]);

  useEffect(() => {
    console.log(responseData);
    if (responseData && responseData.grouperId === curUser._id)
      setShowRespond(true);
    else setShowRespond(false);
  }, [responseData]);

  console.log(curGroup);
  console.log(groupsSet);
  console.log(groupsData);

  if (groupsSet && curGroup && groupsSet.length && curGroup.length) {
    console.log(groupsSet);
    console.log(curGroup);
    console.log(groupsSet[curGroup.groupName].length);
  }

  // useEffect(() => {
  //   if (curGroup && groupsSet) {
  //     console.log("curGroup, groupsSet[curGroup.groupName]");
  //     console.log(curGroup);
  //     console.log(groupsSet);
  //     console.log(groupsSet[curGroup.groupName].has("user4"));
  //     console.log(typeof groupsSet[curGroup.groupName]);
  //   }
  // }, [curGroup]);

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h2>My Friends</h2>
            {hasFriend ? (
              <ListGroup>
                {friendsData.map((friend) => (
                  <ListGroup.Item action href="">
                    {friend.username}

                    <Button
                      onClick={(e) => {
                        console.log(e);
                        deleteFri(friend, e);
                      }}
                    >
                      Delete
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <ListGroup>Empty Friends</ListGroup>
            )}
          </Col>
          <Col>
            <h2>My Groups</h2>

            {hasGroups ? (
              <ListGroup>
                {groupsData.map((group) => (
                  <ListGroup.Item action href="">
                    {group.groupName}
                    <Button
                      onClick={(e) => {
                        console.log(e);
                        deleteGro(group, e);
                      }}
                    >
                      {group.ifGrouper ? "Dismiss" : "Exit"}
                    </Button>
                    {group.ifGrouper ? (
                      <div>
                        <Button
                          onClick={() => {
                            handleInviteShow(group);
                          }}
                        >
                          Invite
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                    {/* {showRespond ? (
                      <div>
                        {agreeAdd ? (
                          <div>
                            {responseData.friendUsername} agree attend in{" "}
                            {responseData.group.groupName}
                            <Button
                              variant="primary"
                              onClick={handleInviteClose}
                            >
                              Close
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {responseData.friendUsername} disagree attend in{" "}
                            {responseData.group.groupName}
                            <Button
                              variant="primary"
                              onClick={handleInviteClose}
                            >
                              Close
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div></div>
                    )} */}
                    <Modal show={inviteShow} onHide={handleInviteClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>
                          invite people add in your group
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <ListGroup.Item>
                          {friendsData.map((friend) => (
                            <Form.Label>
                              {friend.username}
                              {curGroup &&
                              groupsSet &&
                              curGroup.groupName &&
                              groupsSet[curGroup.groupName].has(
                                friend.username
                              ) ? (
                                <Button
                                  variant="primary"
                                  onClick={(e) => {
                                    kick(friend, e);
                                  }}
                                >
                                  Kick
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  onClick={(e) => {
                                    invite(friend, e);
                                  }}
                                >
                                  Add
                                </Button>
                              )}
                            </Form.Label>
                          ))}
                        </ListGroup.Item>
                      </Modal.Body>
                    </Modal>
                    {responseData ? (
                      <Modal show={respondShow} onHide={handleRespondClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>
                            {agreeAdd ? (
                              <div>
                                {responseData.friendUsername} agree attend in{" "}
                                {responseData.group.groupName}
                                <Button
                                  variant="primary"
                                  onClick={handleRespondClose}
                                >
                                  Close
                                </Button>
                              </div>
                            ) : (
                              <div>
                                {responseData.friendUsername} disagree attend in{" "}
                                {responseData.group.groupName}
                                <Button
                                  variant="primary"
                                  onClick={handleRespondClose}
                                >
                                  Close
                                </Button>
                              </div>
                            )}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                          <Button
                            variant="primary"
                            onClick={handleRespondClose}
                          >
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    ) : (
                      <div></div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <ListGroup>Empty Groups</ListGroup>
            )}
          </Col>
        </Row>
        <Row>
          <Button variant="primary" onClick={handleShow}>
            Create Group
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create a group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Label>Group name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a group name"
                onChange={(e) => setGroupName(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" onClick={createGroup}>
                Create
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Container>
    </div>
  );
}
