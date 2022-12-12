const user = require("./user");
const group = require("./group");

const constructorMethod = (app) => {
  app.use("/", user);
  app.use("/group", group);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
