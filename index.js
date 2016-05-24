var express = require('express');
var app = express();
var fs = require("fs");


var bodyParser = require('body-parser');
var multer  = require('multer');


app.use(express.static('public'));   //图片，css都在public下
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

function filter(obj) {

  var res = [];
  for (var i = 0; i < obj.length; i++) {
    if (obj.streamStartTime) {
      res.push(obj[i]);
    };  

  };



  return res;
}

function compare(a,b) {
  if (a.numberofcalling < b.numberofcalling)
    return 1;
  else if (a.numberofcalling > b.numberofcalling)
    return -1;
  else 
    return 0;
}


function process(jsonfile){
  var obj = JSON.parse(jsonfile);

  //element:[streamCreator, numberofcalling, sumofcallingtime]

  var dict = [];
  var re = [];

  for (var i = 0; i < obj.length; i++) {
    if (dict.indexOf(obj[i].streamCreator) == -1) {
        dict.push(obj[i].streamCreator);
        var sumofcallingtime = 0;
        var numberofcalling = 0;

        for (var j = i; j < obj.length; j++) {

          if (obj[j].streamCreator == obj[i].streamCreator) {
            numberofcalling++;
            if (obj[j].streamLength==""||obj[j].streamLength>1081||obj[j].streamLength<1) {
                continue;
            };
            sumofcallingtime+=obj[j].streamLength;
          }
        };

        var element = {"streamCreator": obj[i].streamCreator, "numberofcalling":numberofcalling,
        "sumofcallingtime":sumofcallingtime};
        re.push(element);
    };
  };


  re.sort(compare);


  return re

}











app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})





app.get('/process_get', function (req, res) {


      //Converter Class 
      var Converter = require("csvtojson").Converter;
      var converter = new Converter({});
       
      //end_parsed will be emitted once parsing finished 
      converter.on("end_parsed", function (jsonArray) {

        var json = JSON.stringify(jsonArray)

        // console.log(json); //here is your result jsonarray 
        var resArray = process(json);


        console.log(resArray);

        res.end(JSON.stringify(resArray));

      });
       
      //read from file 
      fs.createReadStream(__dirname + "/tmp_file/"+req.query.Filename).pipe(converter);


})


app.post('/file_upload', function (req, res) {

   console.log(req.files[0]);  // 上传的文件信息

   var des_file = __dirname + "/tmp_file/" + req.files[0].filename;
   fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
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