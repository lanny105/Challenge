var express = require('express');
var app = express();
var fs = require("fs");
var moment = require('moment');


var bodyParser = require('body-parser');
var multer  = require('multer');


app.use(express.static('public'));   
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



var urlencodedParser = bodyParser.urlencoded({ extended: false })

function filter(obj,days) {

  if (days == -1) {
    return obj;
  };

  var re = [];
  for (var i = 0; i < obj.length; i++) {


    if (obj[i].objectId == "") {
      continue;
    };

    if (moment().subtract(days, 'days').valueOf()<moment(obj[i].streamStartTime).valueOf()) {
      re.push(obj[i]);
    };  

  };

  return re;
}

function compare(a,b) {
  if (a.numberofcalling < b.numberofcalling)
    return 1;
  else if (a.numberofcalling > b.numberofcalling)
    return -1;
  else {
    if (a.sumofcallingtime < b.sumofcallingtime)
      return 1;
    else if (a.sumofcallingtime > b.sumofcallingtime)
      return -1;
    else
      return 0;
  }
    
}


function process(jsonfile,days){
  var obj = JSON.parse(jsonfile);

  obj = filter(obj,days);

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
            
            if (obj[j].streamLength==""||obj[j].streamLength>1081||obj[j].streamLength<1) {
                continue;
            };
            numberofcalling++;
            sumofcallingtime+=Number(obj[j].streamLength);
            
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


app.get('/result', function (req, res) {

  // res.writeHead(200,{"Content-Type":"text/html"});

  if (req.query.Filename==null) {
        console.log('filename missing!');
        res.render("result.html", {name:""});
        return;
  };

   res.render("result.html", { name: req.query.Filename });
})


app.get('/process_get', function (req, res) {


      if (req.query.Filename==null||req.query.Nums ==null||req.query.Filename=="") {
        console.log('arguments missing!');
        res.json(JSON.stringify([]));
        return;
      };

      try{
         fs.accessSync(__dirname + "/tmp_file/" + req.query.Filename, fs.R_OK | fs.W_OK)
      }catch(e){
         //error
         console.log('files missing!');
         res.json(JSON.stringify([]));
         return;

      }

      //Converter Class 
      var Converter = require("csvtojson").Converter;
      var converter = new Converter({});
       
      //end_parsed will be emitted once parsing finished 
      converter.on("end_parsed", function (jsonArray) {


        fin = [];

        var json = JSON.stringify(jsonArray)

        // console.log(json); //here is your result jsonarray 


        if (req.query.Nums == -1) {

          var resArray = process(json,1);

          fin.push(resArray);

          resArray = process(json,7);

          fin.push(resArray);

          resArray = process(json,30);

          fin.push(resArray);

          resArray = process(json,-1);

          fin.push(resArray);
        }

        else {
          resArray = process(json,req.query.Nums);

          fin.push(resArray);
        }

        res.json(JSON.stringify(fin));


      });

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

  console.log("start application http://%s:%s", host, port)

})