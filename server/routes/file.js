const express = require("express");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const mongoCollections = require("../config/mongoCollections");
const upload = multer({
  dest: "uploads/",
});
const path = require("path");
var im = require("imagemagick");

const files = mongoCollections.files;

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const filesCollection = await files();
    let fileResult = {
      ...req.file,
      sender: req.user._id,
      receiver: req.body.receiver,
      duration: req.body.duration,
      isGroup: !!req.body.isGroup,
    };
    if (req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      im.resize(
        {
          srcPath: req.file.path,
          dstPath: req.file.destination + req.file.filename + "-25",
          width: 25,
        },
        function (err, stdout, stderr) {
          if (err) throw err;
          im.resize(
            {
              srcPath: req.file.path,
              dstPath: req.file.destination + req.file.filename + "-100",
              width: 100,
            },
            async function (err, stdout, stderr) {
              if (err) throw err;
              fileResult = {
                ...fileResult,
                size25: req.file.destination + req.file.filename + "-25",
                size100: req.file.destination + req.file.filename + "-100",
              };
              await filesCollection.insertOne(fileResult);
              console.log(req.file);
              res.send(fileResult);
            }
          );
        }
      );
    } else {
      await filesCollection.insertOne(fileResult);
      console.log(req.file);
      res.send(fileResult);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({
      code: 500,
      msg: error,
    });
  }
});

router.get("/:fileId", async (req, res) => {
  const fileId = req.params.fileId;
  const size = req.query.size;
  const filesCollection = await files();
  const fileInfo = await filesCollection.findOne({ _id: ObjectId(fileId) });
  console.log("File info is ", fileInfo);
  res.sendFile(
    path.join(process.cwd(), size ? fileInfo.path + "-" + size : fileInfo.path)
  );
});

module.exports = router;
