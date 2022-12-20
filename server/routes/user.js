const router = require("express").Router();
const users = require("../data/users");
const store = require("../store/dataStore");
const response = require("../response/response");
const chatSocket = require("../socket/chatSocket");
const constant = require("../data/constant");
const redisStore = require("../data/redisStore");

router.post("/user", async (req, res) => {
  // const name = res.body.name;
  // const username = res.body.username;
  // const password = res.body.passwd;
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.passwd;
  const isFirebaseAuth = !!req.body.isFirebaseAuth;

  try {
    const user = await users.addUser(name, username, password, isFirebaseAuth);
    res.send(new response(user).success(res));
  } catch (e) {
    console.error(e);
    res.send(new response(null, e).fail(res));
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.passwd;
  try {
    const user = await users.login(username, password);
    let sessions = store.get(store.SESSION_KEY);
    if (sessions == undefined) sessions = new Set([]);

    sessions.add(user._id.toString());
    store.set(store.SESSION_KEY, sessions);
    res.cookie(store.SESSION_KEY, user._id.toString());
    console.log("Set session ", user._id.toString());
    res.send(new response(user).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.post("/add", async (req, res) => {
  // const curUser = req.body.curName;
  console.log(req.body);
  const otherId = req.body.friendId;
  if (!otherId) {
    return res.status(400).json({ message: "Please input your friend id" });
  }
  let session = req.cookies[store.SESSION_KEY];
  let curUser = await users.getUser(session);
  // console.log("\tCurrent user is ", curUser);
  // console.log(JSON.stringify(curUser._id));
  const curId = curUser._id.toString();
  console.log(curId);
  // const otherName = req.body.otherName;
  if (curId === otherId) {
    return res.status(400).json({ message: "You cannot add yourself" });
  }

  if (curUser?.friends?.length) {
    for (let i = 0; i < curUser.friends.length; i++) {
      if (curUser.friends[i]._id.toString() === otherId) {
        return res
          .status(400)
          .json({ message: "you already have this friend~" });
      }
    }
  }

  try {
    const updatedInfo = await users.updateFriend(curId, otherId);
    // const newUser = await users.getUser(curId);
    console.log(`updatedInfo: ${updatedInfo}`);
    // notify user on adding friend by socket
    redisStore.removeUser(curId);
    chatSocket.notifyEvent(constant.event.newFriend, curId, {
      friendId,
    });
    chatSocket.notifyEvent(constant.event.newFriend, curId, {
      friendId,
    });
    res.send(new response(updatedInfo).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.post("/changename", async (req, res) => {
  if (!req.body.newName) {
    return res.status(400).json({ message: "Please input the new name" });
  }
  let session = req.cookies[store.SESSION_KEY];
  let curUser = await users.getUser(session);
  console.log("curUser data:");
  console.log(curUser);

  const updatedInfo = await users.changeName(curUser, req.body.newName);
  console.log(updatedInfo);

  const newCurUser = await users.getUser(curUser._id, true);
  console.log("already change name, newCurUser:");
  console.log(newCurUser);

  res.send(new response(newCurUser).success(res));
});

router.post("/changepswd", async (req, res) => {
  if (!req.body.newPassword) {
    return res.status(400).json({ message: "Please input the new password" });
  }
  let session = req.cookies[store.SESSION_KEY];
  let curUser = await users.getUser(session);
  console.log("curUser data:");
  console.log(curUser);

  const updatedInfo = await users.changePswd(curUser, req.body.newPassword);
  console.log(updatedInfo);

  const newCurUser = await users.getUser(curUser._id, true);
  console.log("already change password, newCurUser:");
  console.log(newCurUser);

  res.send(new response(newCurUser).success(res));
});

router.post("/delete", async (req, res) => {
  try {
    if (!req.body.friendId) {
      return res
        .status(400)
        .json({ message: "please input the friend you want to delete" });
    }
    let session = req.cookies[store.SESSION_KEY];
    let curUser = await users.getUser(session);
    const curId = curUser._id.toString();

    if (curId === req.body.friendId) {
      return res.status(400).json({ message: "you cannot delete yourself~" });
    }

    let temp = "";
    for (let i = 0; i < curUser.friends.length; i++) {
      if (curUser.friends[i]._id.toString() === req.body.friendId) {
        temp = req.body.friendId;
        break;
      }
    }
    if (!temp) {
      return res
        .status(400)
        .json({ message: "you have not this friend, please try again" });
    }

    const updatedInfo = await users.deleteFriend(curId, req.body.friendId);
    console.log("after delete, the curUser data is:");
    console.log(updatedInfo);
    res.send(new response(updatedInfo).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.post("/delofflinefri", async (req, res) => {
  try {
    // userId, inviteUserId
    if (!req.body.userId || !req.body.inviteUserId) {
      return res
        .status(400)
        .json({ message: "please input the friend you already solve" });
    }

    console.log("in delofflinefri");
    console.log(req.body.userId, req.body.inviteUserId);
    const updatedInfo = await users.deleteInviteInfo(
      req.body.userId,
      req.body.inviteUserId
    );
    console.log("after delete, the curUser data is:");
    console.log(updatedInfo);
    res.send(new response(updatedInfo).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.post("/deloffgroup", async (req, res) => {
  console.log(req.body.userId, req.body.inviteUserId);
  try {
    if (!req.body.userId || !req.body.inviteUserId) {
      return res
        .status(400)
        .json({ message: "please input the friend you already solve" });
    }

    const updatedInfo = await users.deleteOfflineGroupInvite(
      req.body.userId,
      req.body.inviteUserId
    );
    console.log("after delete, the curUser data is:");
    console.log(updatedInfo);
    res.send(new response(updatedInfo).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.post("/addofflinefri", async (req, res) => {
  // userId, inviteUserId
  try {
    if (!req.body.userId || !req.body.inviteUserId) {
      return res.status(400).json({
        message: "you must input the people who got invite when he off-online",
      });
    }

    const updatedInfo = await users.updateOfflineInvite(
      req.body.userId,
      req.body.inviteUserId
    );
    console.log("after delete, the curUser data is:");
    console.log(updatedInfo);
    res.send(new response(updatedInfo).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.post("/addoffgroup", async (req, res) => {
  // userId, inviteUserId, attendGroupId
  try {
    if (!req.body.userId || !req.body.inviteUserId || !req.body.attendGroupId) {
      return res.status(400).json({
        message:
          "please input the people you invite, who invite, and which group the people want he friend in",
      });
    }

    const updatedInfo = await users.updateOfflineGroupInvite(
      req.body.userId,
      req.body.inviteUserId,
      req.body.attendGroupId
    );
    console.log("after delete, the curUser data is:");
    console.log(updatedInfo);
    res.send(new response(updatedInfo).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.get("/user", async (req, res) => {
  // console.log(`req.body.name: ${req.query.name}`);
  const name = req.query.name;
  const id = req.query.id;
  // console.log(`req.query: ${req.query}`);
  try {
    if (!name && !id) throw "Bad request.";
    let user = null;
    if (id) user = await users.getUser(id, true);
    else if (name) user = await users.getUserByname(name);
    console.log(`user: ${user}`);
    res.send(new response(user).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.get("/user/list", async (req, res) => {
  const ids = req.query.id;
  try {
    const allUser = await users.getUsers(ids);
    res.send(new response(allUser).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

router.post("/user/avatar", async (req, res) => {
  const avatar = req.body.avatar;
  const userId = req.body.userId
  try {
    const user = await users.setAvatar(userId, avatar);
    res.send(new response(user).success(res));
  } catch (e) {
    res.send(new response(null, e).fail(res));
  }
});

module.exports = router;
