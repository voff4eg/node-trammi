/*jslint node:true, sloppy:true */

var trammi = require('../lib/trammi'),
    port = 8081;

trammi.startServer(port);

console.log("trammi started on port", port);

