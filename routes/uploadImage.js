const express = require('express');
// const fetch  = require('node-fetch');
// const { createGzip, createGunzip } = require('zlib');
// const fileType = require('file-type');
const ImageModel = require("../mongodb/ImageModel")
const router = express.Router();
console.log(process.cwd())



// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// !!!解开注释。使用中间件进行请求验证
// router.use((req, res, next) => {
//   // 检查请求头中的授权信息
//   const authorization = req.get('Authorization');
//   if (authorization !== 'secret-key') {
//     // 如果授权信息不正确，则返回错误
//     return res.status(401).json({error: 'Unauthorized'});
//   }
//   // 否则，允许请求继续
//   next();
// });


// // CONECTION
// mongoose.connect('mongodb://127.0.0.1:27017/CS554-Project');
// /*model*/
// var ImageSchema = new mongoose.Schema({
//     content : String,
//     type    : {type : String, enum:['png','jpg','gif','webp'],default:'jpg'},
//     created : { type: Date, default: Date.now },
// });

// var ImageModel = mongoose.model('Image', ImageSchema);


// 上传并保存图片到数据库
router.post('/upload-img', async (req, res) => {
  try{
    console.log(req.body)
    res.header('Access-Control-Allow-Origin','*')
   
    const img = await new ImageModel({
      content : req.body.imgUrl,
      type    : req.body.type,
    }).save();

    res.send({code:0,data:img ,msg:""});
  }catch(e){
    res.send({code:500,data:{} ,msg:"internal server error"});
  }
	

});

// 读取图片
router.get('/get-img', async (req, res) => {
    try{
        console.log(req.query)
        res.header('Access-Control-Allow-Origin','*')
        let img = await  ImageModel.find({_id : req.query.imgId})    
        res.send(img[0])

    }catch(e){
        res.send({code:500,data:{} ,msg:"internal server error"});
    }

});

module.exports = router;
