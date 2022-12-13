const user = require("./user");
const group = require("./group");
const chats = require("./chats");

const constructorMethod = (app) => {
  app.use("/", user);
  app.use("/group", group);
  app.use("/chat", chats);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
