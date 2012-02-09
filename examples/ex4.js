/*jslint node:true */
var trammiNet = require('../lib/trammiNet');

var roads;

roads = trammiNet.findPath('11631', '11572');
console.log(roads);

roads = trammiNet.findPath('11572', '11500');
console.log(roads);

roads = trammiNet.findPath('11631', '11500');
console.log(roads);

