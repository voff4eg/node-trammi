/*jslint node:true, sloppy:true, unparam:true */

var trammi = require("../lib/trammi");

var line = "1a",
    stopNumber = 39;

trammi.getWaitingTime(line, stopNumber, function (err, timetable) {
    var i, n;

    n = timetable.length;
    for (i = 0; i < n; i += 1) {
        console.log("Mezzo", i + 1, "Attesa =", timetable[i]);
    }
});
