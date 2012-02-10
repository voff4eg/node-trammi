/*jslint node:true */
var trammiNet = require('../lib/trammiNet');

var roads;

console.log('11631 -> 11572');
roads = trammiNet.findPath('11631', '11572');
console.log(roads);

console.log('11572 -> 11500');
roads = trammiNet.findPath('11572', '11500');
console.log(roads);

console.log('11631 -> 11500');
roads = trammiNet.findPath('11631', '11500');
console.log(roads);

