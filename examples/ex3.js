/*jslint node:true, sloppy:true */

var connect = require('connect'),
    trammi = require('../lib/trammi'),
    port = 8081;

trammi.startServer(connect, port);

console.log("trammi started on port", port);

