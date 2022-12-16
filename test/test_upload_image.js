var crypto = require('crypto')
var request = require('request')
var fs = require('fs')

function parse(filePath) {

    let data = fs.readFileSync(filePath);
    data = Buffer.from(data).toString('base64');
 
    return data;
}



imgBase64 = parse('1.jpg');
// 这里要自己获取文件后缀
type = 'jpg'

let opt = {
  method:'POST',
  url:`http://127.0.0.1:8080/uploadImage/upload-img`,
  json:true,
  body   :{
    imgUrl:imgBase64,
    type  :type
  }, 
  headers:{}
} 

console.log(opt)

request(opt,(err,res,body)=>{
    if(err){
      console.log(err);
      return;
    }

    console.log(body);
    console.log(res.headers);

});

