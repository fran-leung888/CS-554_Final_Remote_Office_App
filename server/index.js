const express = require('express');
const app = express();
require('express-async-errors')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const store = require('./store/dataStore')
const configRoutes = require('./routes/router');

const cookieParser = require('cookie-parser');

const usersCollection = require('./data/users')

app.use(cookieParser());

app.use(express.json());

app.use(async (req, res, next) => {
  console.log('Url ', req.originalUrl, ' is in...',)
  if (req.originalUrl === "/login" || (req.originalUrl === "/user" && req.method == 'POST'))
    next()
  else {
    let session = req.cookies[store.SESSION_KEY]
    if (!session)
      throw 'Please login in.'
    let user = await usersCollection.getUser(session)
    console.log('\tCurrent user is ', user.name)
    if (!user)
      throw 'Please login in.'
    console.log('\tAuth verified.')
    next()
  }
})

configRoutes(app)

app.use((err, req, res, next) => {
  // logic
  if (err.stack) {
    console.error(err.stack)
    res.status(400).send({ errMsg: err.stack })
  } else {
    res.status(400).send({ errMsg: err })

  }
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

server.listen(4000, () => {
    console.log('listening on *:4000');
});