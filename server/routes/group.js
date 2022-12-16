const router = require("express").Router();
const groups = require("../data/groups");
const users = require("../data/users");
const store = require("../store/dataStore");
const response = require("../response/response");
const { ObjectID } = require("bson");

router.post("/create", async (req, res) => {
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
    // console.log(res.body);
    console.log(req.query);
    const groupName = req.query.groupName;
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

router.get("/getAll", async (req, res) => {
  let session = req.cookies[store.SESSION_KEY];
  let curUser = await users.getUser(session);
  const curId = curUser._id.toString();

  if (!curId) return res.status(400).json({ message: "Please login frist" });

  const allGroups = await groups.getAllGroup(curUser);

  console.log("already get all groups this person have: ");
  console.log(allGroups);

  res.send(new response(allGroups).success(res));
});

router.post("/delete", async (req, res) => {
  console.log(req.body);
  /* delete logical: 
    1. get the group ID which you want to delete
    2. get the curUser ID, get all group information
    3. compare curUser id === grouper ID, if equal, can delete, if not, cannot delete
    4. when delete success, we also need to get all members who in this group, traverse these members and delete their database one by one
   */
  if (!req.body.groupId)
    return res
      .status(400)
      .json({ message: "Please input the groupId you want to delete" });

  const groupId = req.body.groupId;
  let session = req.cookies[store.SESSION_KEY];
  let curUser = await users.getUser(session);
  // console.log("\tCurrent user is ", curUser);
  // console.log(JSON.stringify(curUser._id));
  const curId = curUser._id.toString();
  if (!curId)
    return res
      .status(400)
      .json({ message: "Please login, then you can delete" });
  console.log("current curId:");
  console.log(curId);

  const group = await groups.getGroup(groupId);
  if (!group)
    return res
      .status(400)
      .json({ message: "We have not find this group, please try again" });
  if (curId !== group.grouperId)
    return res.status(400).json({
      message:
        "you are not this group's grouper, you cannot dismiss this group",
    });

  // create a array to store all this group's members
  let members = group.groupMembers;

  // delete group from groups database
  const ifDeleted = await groups.deleteGroup(group);

  console.log("already delete this group: ");
  console.log(ifDeleted);

  // delete group from users database
  console.log("members.length");
  console.log(members.length);
  if (members.length) {
    for (let i = 0; i < members.length; i++) {
      console.log("delete the members data: ");
      let temp = await users.userDeleteGroup(members[i], group);
      console.log(`members[i]: ${members[i]}, temp: `);
      console.log(temp);
    }
  }
  const newUser = await users.userDeleteGroup(curUser, group);
  console.log("already delete the group info from this user:");
  console.log(newUser);

  res.send(new response(newUser).success(res));
});

router.post("/exit", async (req, res) => {
  /* logical:
      1. input id(must be === the current login user => curUser ID), if not euqal, cannot exit , if equal, can exit
      2. when equal, update curUser database = > delete this group info 
   */
  console.log(req.body);
  const groupId = req.body.groupId;
  const exitUserId = req.body.exitUserId;
  console.log(`the groupId you want to delete : ${groupId}`);
  if (!groupId || !exitUserId)
    return res
      .status(400)
      .json({ message: "Please input the groupId you want to exit" });
  // let session = req.cookies[store.SESSION_KEY];
  // let curUser = await users.getUser(session);
  // const curId = curUser._id.toString();

  // if (!curId) return res.status(400).json({ message: "Please login frist" });

  // get group data by call getGroup by id:
  const group = await groups.getGroup(groupId);
  console.log("the group data you want to exit: ");
  console.log(group);

  if (exitUserId === group.grouperId)
    return res.status(400).json({
      message:
        "You are master this group, cannot exit, but you can dismiss this group",
    });

  const members = group.groupMembers;
  let ifBelong = false;
  if (members.length) {
    for (let i = 0; i < members.length; i++) {
      // console.log(`curId: ${curId}`);
      // console.log(`members[i].memberId: ${members[i].memberId}`);
      if (exitUserId === members[i].memberId) ifBelong = true;
    }
  }

  console.log(`members.length: ${members.length}`);
  console.log(`ifBelong: ${ifBelong}`);
  if (!members.length || !ifBelong)
    return res
      .status(400)
      .json({ message: "You are not in this group, cannot exit" });

  // delete the user info from group data
  const newExitUser = await users.getUser(exitUserId);
  console.log("the exit user data:");
  console.log(newExitUser);
  const newGroup = await groups.deleteMember(newExitUser, group);

  console.log("already delete the user info in group");
  console.log(newGroup);
  // call function to update user data
  const newUser = await users.userDeleteGroup(newExitUser, group);
  console.log("success delete this group in user data");
  console.log(newUser);

  res.send(new response(newUser).success(res));
});

module.exports = router;
