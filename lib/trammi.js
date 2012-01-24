/*jslint es5:true, node:true, sloppy:true, unparam:true, nomen:true */

var request = require("request"),
    jsdom = require('jsdom'),
    trammiDB = require('./trammiDB'),
    lines = trammiDB.lines,
    stopsAC = trammiDB.stops;

var window = jsdom.jsdom().createWindow(),
    JQUERY_URL = 'http://code.jquery.com/jquery-1.7.1.min.js',
    jQuery = null;

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

        function getRawStopInfo() {
            jQuery('.tblttinfo > tr:gt(0)', body).each(function (index, el) {
                var line, eta;

                line = jQuery('td:eq(0)', el).text();
                eta = jQuery('td:eq(1) strong', el).text();

                stopInfo.push({
                    line: line,
                    eta: eta
                });
            });

            cb(false, stopInfo);
        }

        if (!jQuery) {
            jsdom.jQueryify(window, JQUERY_URL, function () {
                jQuery = window.jQuery;
                getRawStopInfo();
            });
        } else {
            getRawStopInfo();
        }
    });
}
exports.getStopInfo = getStopInfo;

function getStopsList(l, callback) {
    var line = lines[l].line, stops = lines[l].info.stop, n = stops.length, i,
        counter = n - 1, data = [];

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
        counter -= 1;

        if (!err) {
            data[index] = res;
        }

        if (counter <= 0) {
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
        var i, p, n, eta, eta2, t = 0, last, total = [0];
        // console.log(require("util").inspect(stops, false, null));

        if (!err) {
            // console.log(lines[lineName].descr);

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
                            total.push(last + eta);
                        }

                        if (t !== 0) {
                            total.push(last + t);
                            t = 0;
                        }
                    } else if (p === 0) {
                        // console.log("d");
                        last = total.pop();
                        total.push(last);
                        total.push(last + (t !== 0 ? t : eta));
                    }
                }
            }
            if (total.length === 1) {
                if (t === 0) {
                    eta = stops[i].eta;
                } else {
                    eta = t;
                }

                total.push(eta);
            }
            // console.log(i, "@", stops[i].descr, "=", eta);

            total.shift();
            cb(false, total);
        }
    });
}
exports.getWaitingTime = getWaitingTime;

function startServer(port) {
    var connect = require('connect'),
        dnode = require('dnode'),
        p = port || 8081,
        server;

    server = connect(
        connect.favicon(__dirname + '/public/favicon.ico'),
        connect.static(__dirname + '/public')
    );

    dnode(function (client) {
        this.getStops = function (cb) {
            cb(stopsAC);
        };

        this.getStopInfo = function (stopNumber, lineCode, cb) {
            getStopInfo(stopNumber, lineCode, function (err, stopInfo) {
                var i, n = stopInfo.length, stopLine;

                for (i = 0; i < n; i += 1) {
                    stopLine = stopInfo[i].line;

                    if (stopLine === lineCode) {
                        cb(stopInfo);
                    }
                }
            });
        };

        this.getTimetable = function (lineName, stopNumber, cb) {
            getWaitingTime(lineName, stopNumber, function (err, timetable) {
                cb(timetable);
            });
        };
    }).listen(server).listen(5050);

    server.listen(p);
}
exports.startServer = startServer;
