	var moment = require('moment');
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


	  return re;

	}
exports.moment = moment;
exports.process = process;




