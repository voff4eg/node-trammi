TRAMMI
======
[![NPM version](https://badge.fury.io/js/trammi.png)](http://badge.fury.io/js/trammi)
[![NGN Dependencies](https://david-dm.org/albertosantini/node-trammi.png)](https://david-dm.org/albertosantini/node-trammi)

TramMI is a web app to estimate the time of arrival of tram and bus, the public
transport of Milan city.

The official apps display only the latest estimated time of arrival.

After you selected the number line and the stop, it is displayed immediately the
waiting time of the next arrival. Then, every minute, the estimated time of
arrivals of the next vehicles are displayed.

Stack software
==============

Frontend
--------

- [Pure](http://purecss.io/)
- [Lato typeface](http://www.google.com/webfonts/specimen/Lato)
- [Yahoo! User Interface](http://yuilibrary.com/)

Browser Support and Testing
---------------------------

* IE 7+
* Latest Stable: Firefox, Chrome, Safari
* iOS 6.x
* Android 4.x

Backend
-------

- [Node.js](http://nodejs.org/)

Dataset
-------

Open data to build tram stops database:

- [Servizio di trasporto pubblico locale dal 16/05/2013 al 05/07/2013](http://dati.comune.milano.it/dato/item/180-180-programmato-del-servizio-di-trasporto-pubblico-locale-dal-16052013-al-05072013.html)
- [Servizio di trasporto pubblico locale dal 22/06/2013 al 30/06/2013](http://dati.comune.milano.it/dato/item/184-184-programmato-del-servizio-di-trasporto-pubblico-locale-dal-22062013-al-30062013.html)
- [Servizio di trasporto pubblico locale dal 01/07/2013 al 01/08/2013](http://dati.comune.milano.it/dato/item/185-185-programmato-del-servizio-di-trasporto-pubblico-locale-dal-01072013-al-01082013.html)

API example
===========

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

Tested with node 0.10.x.

Notes
=====

At the moment only tram lines are implemented.

In support folder, there is the script to recreate the database files, generated
in lib folder as 'trammiDB...' files.

Todo
====

Features
--------

- Total time for a path.

Business ideas
--------------

- Box office on Demand.

Weather info
------------

- [wunderground](http://www.wunderground.com/weather/api/d/documentation.html)
- [Historical weather data](http://allthingsr.blogspot.it/2012/04/getting-historical-weather-data-in-r.html)
- [Tempo di Milano](http://www.tempodimilano.it/)

API Backend
===========

getStops(query, cb)
--------

It finds a list of stops if the words, separated by space(s), contained in the
query, match the field 'acdescr' of the stop.

**Params**

- *query* the chars typed in the autocomplete

**Callback response**

- *stops* array of stops matching the query.


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

getStopsList(lineName, callback)
------------

It retrieves all the stops of a line. On server side there is a cache with a
60 secs. expiring time.

**Params**

- *lineName* name of the line.

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


startServer(port, publicDir, appInst, expressInst)
-----------

It starts a server providing a frontend for the module.

The method adds the following routes to the express instance:

- /trammi/getStops

- /trammi/getStopInfo

- /trammi/getTimetable

**Params**

- *port* port of the server.

- *publicDir* directory of public folder containing the frontend.

- *appInst* an instance of the express.HTTPServer, created with createServer().

- *expressInst* an instance of the express module.


