/*jslint node:true, sloppy:true, unparam:true */

var trammi = require("../lib/trammi");

function displayTimeTable(timetable) {
    var i, n;

    n = timetable.length;
    for (i = 0; i < n; i += 1) {
        console.log("Mezzo", i + 1, "Attesa =", timetable[i].eta);
    }
    console.log("---");
}

trammi.getWaitingTime("1a", 39, function (err, timetable) {
    console.log("1a");
    displayTimeTable(timetable);
});

trammi.getWaitingTime("12a", 27, function (err, timetable) {
    console.log("12a");
    displayTimeTable(timetable);
});


