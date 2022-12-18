const express = require('express');
const { ObjectId } = require('mongodb');
const multer = require("multer");
const mongoCollections = require('../config/mongoCollections');
const upload = multer({
  dest: 'uploads/'
});
const path = require('path')

const files = mongoCollections.files;

const router = express.Router();

router.post("/", upload.single('file'), async (req, res) => {
  try {
    const filesCollection = await files();
    const fileResult = {
      ...req.file,
      sender: req.user._id,
      receiver: req.body.receiver,
      isGroup: !!req.body.isGroup,
    };
    filesCollection.insertOne(fileResult);
    console.log(req.file);
    res.send(fileResult);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      code: 500,
      msg: error
    })
  }
});

router.get("/:fileId", async (req, res) => {
  const fileId = req.params.fileId;
  const filesCollection = await files();
  const fileInfo = await filesCollection.findOne({ _id: ObjectId(fileId) });
  res.sendFile(path.join(process.cwd(), fileInfo.path));
});

module.exports = router;