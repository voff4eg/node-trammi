/*jslint es5:true, node:true, sloppy:true, unparam:true, nomen:true */

var request = require("request"),
    jQuery = require("jquery"),
    cache = require("./trammiCache"),
    lines = require('./trammiDBLines'),
    stopsAC = require('./trammiDBStops');

function getStopInfo(stop, stopLine, cb) {
    request({
        uri: 'http://www.atm.it/gmtools/xmllvstop.asp',
        method: 'POST',
        body: '<stoprequest>' +
            '<code>' + stop + '</code>' +
            '<linename>' + stopLine + '</linename>' +
            '</stoprequest>'
    }, function (err, res, body) {
        var stopInfo = [];

        if (err) {
            console.log('getStopInfo request error.');
            cb(true);

            return;
        }

        jQuery('.tblttinfo > tr:gt(0)', body).each(function (index, el) {
            var line, eta;

            line = jQuery('td:eq(0)', el).text();
            eta = jQuery('td:eq(1) strong', el).text();

            stopInfo.push({
                line: line,
                eta: eta
            });
        });

        if (stopInfo.length > 0) {
            cb(false, stopInfo);
        } else {
            cb(true);
        }

    });
}
exports.getStopInfo = getStopInfo;

function getStopsList(l, callback) {
    var line = lines[l].line,
        stops = lines[l].info.stop,
        n = stops.length,
        data = [],
        counter = 0,
        i;

    function handleStopInfo(stop, index, cb) {
        var s = stop['@'];

        getStopInfo(s.scode, line, function (err, stopInfo) {
            var line = lines[l].line, stopEta, stopLine, m, k;


            if (!err) {
                m = stopInfo.length;
                for (k = 0; k < m; k += 1) {
                    stopLine = stopInfo[k].line;

                    if (stopLine === line) {
                        stopEta = stopInfo[k].eta;

                        if (stopEta === "in arrivo") {
                            stopEta = "1 min";
                        } else if (stopEta === "partenza") {
                            stopEta = "1 min";
                        } else if (stopEta === "--") {
                            stopEta = "1 min";
                        } else if (stopEta === "ricalcolo") {
                            stopEta = "1 min";
                        } else if (stopEta === "in aggiorn") {
                            stopEta = "5 min";
                        } else {
                            stopEta = stopInfo[k].eta;
                        }

                        cb(false, index, {
                            descr: s.sdescr,
                            eta: stopEta
                        });
                    }
                }
            } else {
                cb(true);
            }
        });
    }

    function next(err, index, res) {
        counter += 1;

        if (!err) {
            data[index] = res;
        }

        if (counter === n) {
            callback(false, data);
        }
    }

    for (i = 0; i < n; i += 1) {
        handleStopInfo(stops[i], i, next);
    }
}
exports.getStopsList = getStopsList;

function getWaitingTime(lineName, stopNumber, cb) {

    function getPreviousStop(index, s) {
        var k;

        for (k = index - 1; k > 0; k -= 1) {
            if (s[k]) {
                break;
            }
        }

        return k;
    }

    getStopsList(lineName, function (err, stops) {
        var i, p, n, eta, eta2, t = 0, last, total = [{eta: 0, pnum: -1}];
        // console.log(require("util").inspect(stops, false, null));

        if (!err) {
            // console.log(lines[lineName].way);

            n = stops.length;
            for (i = stopNumber - 1; i > 0; i -= 1) {
                if (stops[i]) {
                    if (!stops[i - 1]) {
                        p = getPreviousStop(i, stops);
                    } else {
                        p = i - 1;
                    }

                    eta = parseInt(stops[i].eta, 10);
                    eta2 = 0;
                    if (stops[p]) {
                        eta2 = parseInt(stops[p].eta, 10);
                    }

                    // console.log(i, "@", stops[i].descr, "=", eta);

                    if (eta >= eta2 && t === 0) {
                        // console.log("a");
                        t = eta;
                    } else if (eta === eta2) {
                        // console.log("b");
                        t += 1;
                    } else if (eta < eta2) {
                        // console.log("c");
                        last = total.pop();
                        total.push(last);
                        if (t === 0) {
                            total.push({
                                eta: last.eta + eta,
                                pnum: i + 1
                            });
                        }

                        if (t !== 0) {
                            total.push({
                                eta: last.eta + t,
                                pnum: i + 1
                            });
                            t = 0;
                        }
                    } else if (p === 0) {
                        // console.log("d");
                        last = total.pop();
                        total.push(last);
                        total.push({
                            eta: last.eta + (t !== 0 ? t : eta),
                            pnum: i + 1
                        });
                    }
                }
            }
            if (total.length === 1) {
                if (t === 0) {
                    eta = stops[i].eta;
                } else {
                    eta = t;
                }

                total.push({
                    eta: eta,
                    pnum: i + 1
                });
            }
            // console.log(i, "@", stops[i].descr, "=", eta);

            total.shift();
            cb(false, total);
        }
    });
}
exports.getWaitingTime = getWaitingTime;

function startServer(port, directory, appInst, expressInst) {
    var express = expressInst || require('express'),
        path = require('path'),
        p = port || 8081,
        d = path.resolve(__dirname, directory || __dirname + '/public'),
        app = appInst || express.createServer();

    console.log("trammi static folder is " + d);

    app.configure(function () {
        app.set("jsonp callback", true);

        // app.use(express.favicon(d + '/favicon.ico'));
        app.use(express.static(d));
        app.use(express.bodyParser());
        app.use(express.errorHandler());
        app.use(express.cookieParser());
    });

    app.get("/trammi/getStops", function (req, res) {
        var query = req.query.q,
            cacheKey = "queryCache#" + query,
            words = query.toLowerCase().split(' '),
            acdescr,
            i,
            j,
            n = stopsAC.length,
            m = words.length,
            stops,
            found;

        stops = cache.get(query);

        if (!stops) {
            stops = [];

            for (i = 0; i < n; i += 1) {
                found = true;
                for (j = 0; j < m; j += 1) {
                    acdescr = stopsAC[i].acdescr.toLowerCase();
                    if (acdescr.indexOf(words[j]) === -1) {
                        found = false;
                        break;
                    }
                }
                if (found) {
                    stops.push(stopsAC[i]);
                }
            }

            cache.put(cacheKey, stops);
        }

        res.json(stops);
    });

    app.get("/trammi/getStopInfo", function (req, res) {
        var stopNumber = req.query.stopNumber,
            lineCode = req.query.lineCode;

        getStopInfo(stopNumber, lineCode, function (err, stopInfo) {
            var i, n = stopInfo.length, stopLine;

            for (i = 0; i < n; i += 1) {
                stopLine = stopInfo[i].line;

                if (stopLine === lineCode) {
                    res.json(stopInfo);
                }
            }
        });
    });

    app.get("/trammi/getTimetable", function (req, res) {
        var lineName = req.query.lineName,
            stopNumber = req.query.stopNumber,
            cacheKey = "stopCache#" + lineName + "/" + stopNumber,
            timetable;

        timetable = cache.get(cacheKey);

        if (!timetable) {
            getWaitingTime(lineName, stopNumber, function (err, timetable) {
                cache.put(cacheKey, timetable, 60000);
                res.json(timetable);
            });
        } else {
            res.json(timetable);
        }
    });

    if (!appInst) {
        app.listen(p);
        console.log("trammi listening on port " + p);
    }
}
exports.startServer = startServer;
