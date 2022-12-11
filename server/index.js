const express = require("express");
const app = express();
require("express-async-errors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const store = require("./store/dataStore");
const configRoutes = require("./routes/router");

const cookieParser = require("cookie-parser");

const usersCollection = require("./data/users");

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

  socket.on("addFriend", (data) => {
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
});

server.listen(4000, () => {
  console.log("listening on *:http://localhost:4000");
});
