var express = require('express');
var app = express();
var fs = require("fs");


var bodyParser = require('body-parser');
var multer  = require('multer');


app.use(express.static('public'));   //图片，css都在public下
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})


app.get('/process_get', function (req, res) {

   // 输出 JSON 格式
   response = {
       Filename:req.query.first_name
   };
   console.log(response);





   
   res.end(JSON.stringify(response));
})


app.post('/process_post', urlencodedParser, function (req, res) {

   // 输出 JSON 格式
   response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

app.post('/file_upload', function (req, res) {

  // console.log(req)


   console.log(req.files[0]);  // 上传的文件信息

   var des_file = __dirname + "/tmp_file/" + req.files[0].filename;
   fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
         
         }

          res.end( req.files[0].filename );
       });
   });
})



var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})