import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

import users from "../data/users";

export default function Friends() {
  const [hasFriend, setHasFriend] = useState(false);
  const [friendsData, setFriendsData] = useState(undefined);
  //   const [deleteSuccess, setDeleteSuccess] = useState(false);
  const curUser = useSelector((state) => state.user);
  console.log(`curUser: ${JSON.stringify(curUser)}`);

  const navigate = useNavigate();

  useEffect(() => {
    if (curUser.friends.length) {
      console.log("in");
      setHasFriend(true);
      setFriendsData(curUser.friends);
    } else {
      setHasFriend(false);
      setFriendsData(undefined);
    }
  }, []);
  if (!curUser._id) {
    return <div>Error: please login in</div>;
  }

  const deleteFri = async (friend, e) => {
    console.log(friend);
    if (friend._id) {
      let deleteF = await users.deleteFriend(friend._id);
      console.log(deleteF);
      if (deleteF.code === 200) {
        navigate("/login");
      }
    }
  };

  return (
    <div>
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
        <div>You have not friends for now</div>
      )}
    </div>
  );
}
