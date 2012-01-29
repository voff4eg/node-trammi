/*jslint node:true, sloppy:true, unparam:true */

var trammi = require("../lib/trammi");

var stopCode, stopLine;


stopCode = 12254;
stopLine = 1;
trammi.getStopInfo(stopCode, stopLine, function (err, info) {
    console.log(1, 12254, info);
});

stopCode = 16978;
stopLine = 12;
trammi.getStopInfo(stopCode, stopLine, function (err, info) {
    console.log(12, 16978, info);
});
