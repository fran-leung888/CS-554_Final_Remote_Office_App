const user = require("./user");
const group = require("./group");
const chats = require("./chats");
const uploadImage = require("./uploadImage");
const socket = require("./socket");
const constructorMethod = (app) => {
  app.use("/", user);
  app.use("/group", group);
  app.use("/chat", chats);
  app.use("/uploadImage",uploadImage);
  app.use('/socket',  socket);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
