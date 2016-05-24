var moment = require('moment');


        var x = 28663.12133
        var d = moment.duration(x, 'seconds');
        var hours = Math.floor(d.asHours());
        var mins = Math.floor(d.asMinutes()) - hours * 60;

        var seconds = (x - hours*3600-mins*60).toFixed(2);


        console.log(hours + "h " + mins + "m " +seconds +"s ");
