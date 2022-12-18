// // ws 服务
// var express      = require("express");
// var expressWs    = require("express-ws");
// const ImageModel = require("../mongodb/ImageModel")

// // // mongoose
// // var mongoose = require('mongoose');
// // mongoose.Promise = global.Promise;
// // // // CONECTION
// // // mongoose.connect('mongodb://127.0.0.1:27017/CS554-Project');
// // // /*model*/
// // var ImageSchema = new mongoose.Schema({
// //     content : String,
// //     type    : {type : String, enum:['png','jpg','gif','webp'],default:'jpg'},
// //     created : { type: Date, default: Date.now },
// // });
// // var ImageModel = mongoose.model('Image', ImageSchema);





// var router = express.Router();
// expressWs(router);  //将 express 实例上绑定 websocket 的一些方法


// router.ws("/uploadImage", async function (ws, req) {

// 	ws.send("connect successfully!");
// 	ws.on("message", async function (msg) {
// 	    let msgObj = JSON.parse(msg);
// 		const img = await new ImageModel({
// 	      content : msgObj.imgUrl,
// 	      type    : msgObj.type,
// 	    }).save();
	    
// 	    ws.send(JSON.stringify({code:0,data:img ,msg:""}));
		
// 	});
// })





// module.exports = router;
