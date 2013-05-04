"use strict";

var trammi = require("../lib/trammi");

function displayStopInfo(err, info) {
    if (err) {
        console.log("stop info empty");
    } else {
        console.log(info);
    }
}

trammi.getStopInfo(12254, 1, displayStopInfo);
trammi.getStopInfo(11572, 2, displayStopInfo);
trammi.getStopInfo(16978, 12, displayStopInfo);
