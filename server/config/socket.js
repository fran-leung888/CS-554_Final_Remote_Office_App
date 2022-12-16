const express = require("express");
const app = express();
require("express-async-errors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

module.exports = { io, app, express, server };
