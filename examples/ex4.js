/*jslint node:true */
var trammiNet = require('../lib/trammiNet');

// var roads = possibleRoutes(createNet(), '12254', '12249');
// var roads = possibleRoutes(createNet(), '12254', '11888');
var roads = trammiNet.possibleRoutes('11631', '11572');
console.log(roads);

