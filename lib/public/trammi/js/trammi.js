/*global YUI */

YUI.add('trammi', function (Y) {
    'use strict';

    var timer = 0;

    Y.tramMI = Y.Base.create('tramMI', Y.View, [], {
        initializer: function () {
            var stopSearchView = new Y.StopSearchView();

            stopSearchView.render();

            Y.on('get-timetable', this.getTimeTable, this);
        },

        getTimeTable: function (stop) {
            var mainStop = new Y.StopModel();

            mainStop.set('acdescr', stop.acdescr).save();

            if (timer) {
                timer.cancel();
            }

            function createTimeTable(timetable, lcode) {
                var timeTableView,
                    etas = [],
                    pnums = [],
                    n,
                    i;

                Y.one('#timeTableContainer').empty();

                n = timetable.length;
                for (i = 0; i < n; i += 1) {
                    if (timetable[i].line === lcode) {
                        etas.push(timetable[i].eta);
                        pnums.push(timetable[i].pnum);
                    }
                }

                timeTableView = new Y.TimeTableView({
                    model: new Y.StopModel({
                        eta: etas,
                        pnum: pnums,
                        sdescr: stop.sdescr,
                        snum: stop.snum
                    })
                });
                timeTableView.render();
            }

            Y.jsonp('/trammi/getStopInfo?' +
                'stopNumber=' + stop.scode + '&' +
                'lineCode=' + stop.lcode, function (timetable) {

                    createTimeTable(timetable, stop.lcode);
                });

            Y.jsonp('/trammi/getTimetable?' +
                'lineName=' + stop.sline + '&' +
                'stopNumber=' + stop.snum, function (timetable) {
                    createTimeTable(timetable);
                });

            timer = Y.later(60000, this, Y.jsonp, [
                '/trammi/getTimetable?' +
                    'lineName=' + stop.sline + '&' +
                    'stopNumber=' + stop.snum,
                function (timetable) {
                    createTimeTable(timetable);
                }
            ], true);
        }
    });

}, '1.0.0', { requires: [
    'jsonp',
    'jsonp-url',
    'view',
    'stopsearch-view',
    'stop-model',
    'timetable-view'
]});

