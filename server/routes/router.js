const user = require("./user");
const chats = require("./chats");

const constructorMethod = (app) => {
  app.use("/", user);
  app.use("/chat", chats);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
