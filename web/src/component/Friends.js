import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

export default function Friends() {
  const [hasFriend, setHasFriend] = useState(false);
  const [friendsData, setFriendsData] = useState(undefined);
  const [hasGroups, setHasGroups] = useState(false);
  const [groupsData, setGroupsData] = useState(undefined);
  const [groupName, setGroupName] = useState("");
  const [show, setShow] = useState(false);
  const [inviteShow, setInviteShow] = useState(false);
  //   const [deleteSuccess, setDeleteSuccess] = useState(false);
  const curUser = useSelector((state) => state.user);
  console.log(`curUser: ${JSON.stringify(curUser)}`);

  const navigate = useNavigate();
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
  }, []);
  // if (!curUser._id) {
  //   return <div>Error: please login in</div>;
  // }

  useEffect(() => {
    setGroupsData(curUser.groups);
  }, [curUser]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInviteClose = () => setInviteShow(false);
  const handleInviteShow = () => setInviteShow(true);

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
      let exitG = await groups.exit(group.groupId);
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

  const invite = async () => {
    setInviteShow(false);
    /*Need use socket.io to achieve invite other users add in this group */
  };

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
                      <Button onClick={handleInviteShow}>Invite</Button>
                    ) : (
                      ""
                    )}
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
                              <Button
                                variant="primary"
                                type="submit"
                                onClick={invite}
                              >
                                add
                              </Button>
                            </Form.Label>
                          ))}
                        </ListGroup.Item>
                      </Modal.Body>
                    </Modal>
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
