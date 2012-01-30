/*jslint sloppy:true */
/*global YUI, DNode */

YUI.add('trammi', function (Y) {
    var timer = 0, timer2;

    Y.tramMI = Y.Base.create('tramMI', Y.View, [], {
        initializer: function () {
            var styleSheet = Y.StyleSheet(),
                stopSearchView = new Y.StopSearchView();

            stopSearchView.render();

            Y.on("get-timetable", this.getTimeTable, this);

            styleSheet.set("#nextUpdate", {
                'margin-top': '25px'
            });

            timer2 = new Y.Timer({
                length: 3000,
                repeatCount: 100,
                callback: function () {
                    Y.one('#nextUpdate').setContent(timer2.get('step'));
                }
            });

            Y.one(".content").removeClass('yui3-loading');
        },

        getTimeTable: function (stop) {

            if (timer) {
                timer.cancel();
            }

            function createTimeTable(timetable, lcode) {
                var i, timeTableView;

                // console.log(timetable);
                Y.all('.btn-group').remove();

                for (i = 0; i < timetable.length; i += 1) {
                    if (!timetable[i].line || timetable[i].line === lcode) {
                        timeTableView = new Y.TimeTableView({
                            model: new Y.StopModel({
                                eta: timetable[i].eta,
                                pnum: timetable[i].pnum,
                                sdescr: stop.sdescr,
                                snum: stop.snum,
                                vnum: i + 1
                            })
                        });
                        timeTableView.render();
                        timer2.stop();
                    }
                }
                timer2.start();
            }

            Y.DNode.getStopInfo(stop.scode, stop.lcode, function (timetable) {
                createTimeTable(timetable, stop.lcode);
            });

            timer = Y.later(60000, this, Y.DNode.getTimetable, [
                stop.sline,
                stop.snum,
                createTimeTable
            ], true);
        }
    });

}, '1.0.0', { requires: [
    'dnode',
    'view',
    'stylesheet',
    'stopsearch-view',
    'stop-model',
    'timetable-view',
    'gallery-timer'
]});

