var crypto = require('crypto')
var request = require('request')
var fs = require('fs')
const WebSocket = require('ws');

var socket = new WebSocket("ws://localhost:8080/socket/uploadImage");




function parse(filePath) {

    let data = fs.readFileSync(filePath);
    data = Buffer.from(data).toString('base64');
    
    return data;
}


socket.addEventListener('open', function (event) {
    console.log('socket is open')

    const imgBase64 = parse('2.jpg');
     let imgItem = {
      imgUrl:imgBase64,
      type  :'jpg' //自己获取文件后缀写在这里
    }
    socket.send(JSON.stringify(imgItem));
});


socket.addEventListener('message', function (event) {
    console.log('Message from server', event.data); 
});




// socket.onopen = function (e) { 
//     setTimeout(() => socket.send('ijuly'), 1000)
// }
// socket.onmessage = function(e) { 
//     console.log(e)
// }   
