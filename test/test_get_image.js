var crypto = require('crypto')
var request = require('request')
var fs = require('fs')

function save_base64_img(data , save_path){
  // var base64 = data.replace(/^data:image/w+;base64,/, ""); // 去掉图片base64码前面部分data:image/png;base64
  var dataBuffer = new Buffer(data, 'base64'); //把base64码转成buffer对象，
  console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
  fs.writeFileSync(save_path,dataBuffer)//用fs写入文件

}



let opt = {
  method:'GET',
  url:`http://127.0.0.1:8080/uploadImage/get-img?imgId=639aa9c72ae5e5a5f6380d92`,
  json:true,
 
  headers:{},
} 

console.log(opt)

request(opt,(err,res,body)=>{
    if(err){
      console.log(err);
      return;
    }



    console.log(body);
    console.log(res.headers);

    save_base64_img(body.content,'out.jpg')

});

