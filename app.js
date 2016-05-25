var express = require('express');
var app = express();
var fs = require("fs");
var util = require('./mymodule/util');
var moment = util.moment;


var bodyParser = require('body-parser');
var multer  = require('multer');



app.use(express.static('public'));   
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})


app.get('/result', function (req, res) {

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

    if (req.query.Nums == -1) {

        var resArray = util.process(json,1);    //past day

        fin.push(resArray);

        resArray = util.process(json,7);    //past week

        fin.push(resArray);

        resArray = util.process(json,30);   //past month

        fin.push(resArray);

        resArray = util.process(json,-1);   //all

        fin.push(resArray);
      }

      else {
          resArray = util.process(json,req.query.Nums); //any time

          fin.push(resArray);
      }

      res.json(JSON.stringify(fin));


    });

    fs.createReadStream(__dirname + "/tmp_file/"+req.query.Filename).pipe(converter);
})


app.post('/file_upload', function (req, res) {

   // console.log(req.files[0]);  

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



var server = app.listen(8080, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("start application http://%s:%s", host, port);

})