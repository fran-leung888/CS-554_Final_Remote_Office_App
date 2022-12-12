const router = require("express").Router();
const groups = require("../data/groups");
const users = require("../data/users");
const store = require("../store/dataStore");
const response = require("../response/response");

router.post("/createGroup", async (req, res) => {
  console.log(req.body);
  // const groupName = res.body.groupName;
  const groupName = req.body.groupName;
  if (!groupName) {
    res.send(new response(null).fail(res));
  }
  let session = req.cookies[store.SESSION_KEY];
  let curUser = await users.getUser(session);
  const curId = curUser._id.toString();
  if (!curId) {
    // return res
    //   .status(400)
    //   .json({ message: "you have not login, please login and try again" });
    res.send(new response(null).fail(res));
  }
  try {
    // create a group
    const grouperId = curId;
    const grouperUsername = curUser.username;
    const group = await groups.addGroup(groupName, grouperId, grouperUsername);
    console.log("create a group, and success store in group database");
    console.log(group);

    // add the group to user
    const ifGrouper = true;
    const groupId = group._id.toString();
    const newUser = await users.userUpdateGroup(
      curId,
      groupId,
      groupName,
      ifGrouper
    );
    console.log("success update the group data in user database:");
    console.log(newUser);
    res.send(new response(newUser).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.post("/addToGroup", async (req, res) => {
  try {
    console.log(req.body);
    const memberId = req.body.memberId;
    // const groupId = req.body.groupId;
    const groupName = req.body.groupName;
    if (!memberId || !groupName)
      return res.status(400).json({
        message:
          "Please input the person you want to add and input the groupName you want to add",
      });
    // const memberUsername = req.body.memberUsername
    const member = await users.getUser(memberId);
    const group = await groups.getGroupByname(groupName);
    // console.log(`group.groupMembers.length: ${group.groupMembers.length}`);
    // console.log(`member._id.toString(): ${member._id.toString()}`);
    if (group.groupMembers.length) {
      for (let i = 0; i < group.groupMembers.length; i++) {
        // console.log(group.groupMembers.memberId);
        if (group.groupMembers[i].memberId === member._id.toString()) {
          return res.status(400).json({
            message: "this person already in this group",
          });
        }
      }
    }
    // console.log("the member want to add to group:");
    // console.log(member);

    // console.log("the group someone want to add in: ");
    // console.log(group);

    const newGroup = await groups.addMember(member, group);
    console.log("already add this member in group");
    console.log(newGroup);

    const curId = memberId;
    const groupId = group._id.toString();
    const ifGrouper = false;
    const newUser = await users.userUpdateGroup(
      curId,
      groupId,
      groupName,
      ifGrouper
    );

    console.log("update the user database(add the group info)");
    console.log(newUser);

    res.send(new response(newUser).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.get("/getByName", async (req, res) => {
  try {
    console.log(req.body);
    const groupName = req.body.groupName;
    if (!groupName)
      return res
        .status(400)
        .json({ message: "Please input a group you want to search" });

    const group = await groups.getGroupByname(groupName);
    console.log("get group by name");
    console.log(group);
    res.send(new response(group).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

module.exports = router;
