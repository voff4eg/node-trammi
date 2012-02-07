/*jslint node:true, sloppy:true, nomen: true, unparam:true */

var fs = require('fs'),
    util = require('util'),
    net = require('./trammiDBNet').net;

function member(array, value) {
    var found = false;

    array.forEach(function (element) {
        if (element === value) {
            found = true;
        }
    });

    return found;
}

function flatten(arrays) {
    var result = [];

    arrays.forEach(function (array) {
        array.forEach(function (element) {
            result.push(element);
        });
    });

    return result;
}

function filter(test, array) {
    var result = [];

    array.forEach(function (element) {
        if (test(element)) {
            result.push(element);
        }
    });

    return result;
}

function possibleRoutes(from, to) {
    var isCompleted = false;

    function findRoutes(route) {
        var end;

        function notVisited(road) {
            return !member(route.places, road.to);
        }

        function continueRoute(road) {
            return findRoutes({
                places: route.places.concat([road.to]),
                length: route.length + road.d
            });
        }

        end = route.places[route.places.length - 1];

        if (isCompleted) {
            return [];
        } else if (end === to) {
            isCompleted = true;
            return [route];
        } else {
            return flatten(filter(notVisited, net[end]).map(continueRoute));
        }
    }

    return findRoutes({places: [from], length: 0});
}
exports.possibleRoutes = possibleRoutes;

function shortestRoute(from, to) {
    var currentShortest = null;

    possibleRoutes(from, to).forEach(function (route) {
        if (!currentShortest || currentShortest.length > route.length) {
            currentShortest = route;
        }
    });

    return currentShortest;
}

