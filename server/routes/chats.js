const router = require("express").Router();
const chats = require("../data/chats");
const store = require("../store/dataStore");
const response = require("../response/response");

router.post("/", async (req, res) => {
  const id = req.body.id;
  const from = req.body.from;
  const to = req.body.to;
  const message = req.body.message;
  const user = req.body.user;
  const type = req.body.type;
  try {
    let chat;
    if (id) {
      chat = await chats.addMessageById(id, user._id, message, type);
    } else {
      chat = await chats.addMessage(from, to, message, type);
    }
    res.send(new response(chat).success(res));
  } catch (e) {
    console.log(e);
    res.send(new response(null, e.toString()).fail(res));
  }
});

router.get("/", async (req, res) => {
  const id = req.query.id;
  try {
    const chat = await chats.getChatsByUser(id);
    res.send(new response(chat).success(res));
  } catch (e) {
    console.log(e);
    res.send(new response(null, e.toString()).fail(res));
  }
});


router.get("/messages", async (req, res) => {
  const chatId = req.query.id
  try {
    const messages = await chats.getMessages(chatId);
    res.send(new response(messages).success(res));
  } catch (e) {
    console.log(e);
    res.send(new response(null, e.toString()).fail(res));
  }
})

module.exports = router;
