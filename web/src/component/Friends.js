import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

export default function Friends() {
  const [hasFriend, setHasFriend] = useState(false);
  const [friendsData, setFriendsData] = useState(undefined);
  const curUser = useSelector((state) => state.user);
  console.log(`curUser: ${JSON.stringify(curUser)}`);

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

  const deleteFri = (friend) => {
    console.log(friend);
  };

  return (
    <div>
      {hasFriend ? (
        <ListGroup>
          {friendsData.map((friend) => (
            <ListGroup.Item action href="">
              {friend.username}
              <Button onClick={deleteFri(friend)}>Delete</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div>You have not friends for now</div>
      )}
    </div>
  );
}
