TRAMMI
======

This module contains an app to estimate the time of arrival of tram and bus,
the public transport of Milan city.

After you selected the number line and the stop, it is displayed immediately the
waiting time of the next arrival. Then, every minute, the estimated time of
arrivals of the next vehicles are displayed.

Example
========

    var trammi = require("trammi");

    // stop code 12254, line 1
    trammi.getStopInfo(12254, 1, function (err, info) {
        console.log(info);
    });

    // line 1, stop number 39
    trammi.getWaitingTime("1a", 39, function (err, timetable) {
        var i, n;

        n = timetable.length;
        for (i = 0; i < n; i += 1) {
            console.log("Vehicle", i + 1, "Waiting =", timetable[i]);
        }
    });

    trammi.startServer(8081);

Installation
============

To install with [npm](http://github.com/isaacs/npm):

    npm install trammi

Tested with node 0.6.8.

Notes
=====

At the moment only tram lines are implemented.

Methods
=======

getStopInfo(stop, stopLine, cb)
-----------

It retrieves the info of the stop.

**Params**

- *stop* code of the stop.

- *stopLine*  number of the line.

**Callback response**

- *stopInfo* array.

    - *line* number of the line.

    - *eta* estimated time of arrival (string).

getStopsList(l, callback)
------------

It retrieves all the stops of a line.

**Params**

- *l* name of the line.

**Callback response**

- *stopInfo* array

    - *descr* description of the top.

    - *eta* estimated time of arrival (number).

getWaitingTime(lineName, stopNumber, cb)
--------------

It retrieves the arrivals of all the vehicles until a stop.

**Params**

- *lineName* name of the line.

- *stopNumber* index of the stop related to the line.

**Callback response**

- *timetable* array containing the estimated time of arrivals in minutes.


startServer(port)
-----------

It starts a server providing a frontend for the module.

**Params**

- *port* port of the server

