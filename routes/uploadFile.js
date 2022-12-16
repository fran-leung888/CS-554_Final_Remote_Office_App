// const express = require('express');
// const fetch = require('node-fetch');
// const { createGzip, createGunzip } = require('zlib');
// const fileType = require('file-type');

// const router = express.Router();

// // 使用中间件进行请求验证
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

// // router.get('/send-file', (req, res) => {
// //   // 检查请求体中的文件类型
// //   const fileType = fileType.fromBuffer(req.body);
// //   if (fileType.ext !== 'zip') {
// //     // 如果文件不是 zip 文件，则返回错误
// //     return res.status(400).json({error: 'Invalid file type'});
// //   }

// //   // 创建一个 gzip 对象用于压缩文件
// //   const gzip = createGzip();
// //   // 将请求体中的文件压缩到 gzip 对象
// //   req.body.pipe(gzip);

// //   let compressedData = '';
// //   gzip.on('data', chunk => {
// //     // 将压缩后的数据拼接到 compressedData 变量中
// //     compressedData += chunk;
// //   });
// //   gzip.on('end', () => {
// //     // 当压缩完成后，使用 fetch 发送文件
// //     fetch('http://www.example.com/receive-file', {
// //       method: 'POST',
// //       body: compressedData // 将压缩后的文件作为请求发送
// //     })
// //     .then(response => response.json())
// //     .then(json => res.json(json))
// //     .catch(err => {
// //         console.error(err);
// //   })
// // });

// //   module.exports = router;
