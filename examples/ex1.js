/*jslint node:true, sloppy:true, unparam:true */

var trammi = require("../lib/trammi");

var stopCode = 12254,
    stopLine = 1;

trammi.getStopInfo(stopCode, stopLine, function (err, info) {
    console.log(info);
});
