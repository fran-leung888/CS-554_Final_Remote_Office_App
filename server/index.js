const { io, app, express, server } = require('./config/socket')
const chatSocket = require('./socket/chatSocket')
const store = require("./store/dataStore");
const configRoutes = require("./routes/router");

const cookieParser = require("cookie-parser");

const usersCollection = require("./data/users");
const users = require("./data/users");
const groups = require("./data/groups");

app.use(cookieParser());

app.use(express.json());

app.use(async (req, res, next) => {
  console.log("Url ", req.originalUrl, " is in...");
  if (
    req.originalUrl === "/login" ||
    (req.originalUrl === "/user" && req.method == "POST")
  )
    next();
  else {
    let session = req.cookies[store.SESSION_KEY];
    if (!session) throw "Please login in.";
    let user = await usersCollection.getUser(session);
    console.log("\tCurrent user is ", user.name);
    if (!user) throw "Please login in.";
    console.log("\tAuth verified.");
    next();
  }
});

configRoutes(app);

app.use((err, req, res, next) => {
  // logic
  if (err.stack) {
    console.error(err.stack);
    res.status(400).send({ errMsg: err.stack });
  } else {
    res.status(400).send({ errMsg: err });
  }
});

// global.onlineUsers = new Map();
onlineName = [];
io.on("connection", (socket) => {
  console.log("a user connected");

  // global.chatSocket = socket;
  socket.on("addUser", (userId) => {
    console.log(`addUser: ${userId}`);
    console.log(`socket.id:${socket.id}`);
    if (userId) onlineName.push({ socketId: socket.id, id: userId });
    console.log(onlineName);
    // onlineUsers.set(userId, socket.id);
  });

  socket.on("addFriend", async (data) => {
    // console.log(`addFriend data: ${data}`);
    // const sendToUser = onlineUsers.get(data.friendId);
    let sendToUser = "";
    for (let i = 0; i < onlineName.length; i++) {
      if (onlineName[i].id === data.friendId)
        sendToUser = onlineName[i].socketId;
    }

    console.log(`sendToUser: ${sendToUser}`);
    if (sendToUser) {
      console.log(`will emit addFriend response: `);
      console.log(data);
      console.log(sendToUser);
      io.to(sendToUser).emit("addFriendResponse", data);
    } else {
      console.log("curUser want to add people are not online");
      console.log(data);
      // storeFriend(data);
      const temp = await users.updateOfflineInvite(data.friendId, data.applyId);
      console.log(temp);
    }
  });

  socket.on("agree", (data) => {
    console.log(`agreeFriend:`);
    console.log(data);
    let sendToUser = "";
    for (let i = 0; i < onlineName.length; i++) {
      if (onlineName[i].id === data.applyId)
        sendToUser = onlineName[i].socketId;
    }
    console.log(`sendToUser: ${sendToUser}`);
    if (sendToUser) {
      // const sendToUser = onlineUsers.get(data.applyId);
      io.to(sendToUser).emit("agreeResponse", data);
    }
  });

  socket.on("invite", async (data) => {
    console.log("I want to invite this one:");
    console.log(JSON.stringify(data));

    let sendToUser = "";
    for (let i = 0; i < onlineName.length; i++) {
      if (onlineName[i].id === data.invite._id)
        sendToUser = onlineName[i].socketId;
    }
    console.log(`sendToUser: ${sendToUser}`);
    if (sendToUser) {
      io.to(sendToUser).emit("inviteResponse", data);
    } else {
      console.log("curUser want to add people are not online");
      console.log(data);
      const temp = await users.updateOfflineGroupInvite(
        data.invite._id,
        data.grouperId,
        data.group.groupId
      );
      console.log(temp);
    }
  });

  socket.on("addGroup", (data) => {
    console.log("the friend agree/disagree add to group, tell you:");
    console.log(data);

    let sendToUser = "";
    for (let i = 0; i < onlineName.length; i++) {
      if (onlineName[i].id === data.grouperId)
        sendToUser = onlineName[i].socketId;
    }
    console.log(`sendToUser: ${sendToUser}`);

    if (sendToUser) {
      io.to(sendToUser).emit("addGroupRespond", data);
    }
  });

  socket.on("disconnect", () => {
    for (let i = 0; i < onlineName.length; i++) {
      if (onlineName[i].socketId === socket.id) {
        onlineName.splice(0, 1);
      }
    }
    console.log(`disconnect onlineName`);
    console.log(onlineName);
    console.log("user disconnected");
  });

  chatSocket.joinRoom(socket);
});

server.listen(4000, () => {
  console.log("listening on *:http://localhost:4000");
});
