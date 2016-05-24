var moment = require('moment');
console.log(moment('2016-04-16T02:57:29.320Z').subtract(10, 'days').valueOf());
console.log(moment().valueOf());

// console.log(moment().subtract(10, 'days').format());
