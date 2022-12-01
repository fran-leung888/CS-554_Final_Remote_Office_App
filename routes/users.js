const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const func = require("../data/functions");
var xss = require("xss");

