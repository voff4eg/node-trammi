/*jslint sloppy:true, unparam:true */
/*global YUI, DNode */

YUI.add('trammi', function (Y) {
    var timer = 0;

    Y.tramMI = Y.Base.create('tramMI', Y.View, [], {
        initializer: function () {
            var stopSearchView = new Y.StopSearchView();

            stopSearchView.render();

            Y.on("get-stopinfo", this.getStopInfo, this);
            Y.on("get-timetable", this.getTimetable, this);

            Y.one(".container").removeClass('yui3-loading');
        },

        reset: function (e) {
            // var fragment = Y.one(Y.config.doc.createDocumentFragment());

            // Y.Array.each(e.models, function (model) {
            //     var view = new Y.AssetView({model: model});
            //     fragment.append(view.render().container);
            // });

            // Y.one('#assetsListContainer').setContent(fragment);
        },

        getStopInfo: function (stop) {
            Y.DNode.getStopInfo(stop.scode, stop.lcode, function (timetable) {
                var i, timeTableView;

                // console.log(timetable);
                Y.all('.timeTableViewContainer').remove();
                for (i = 0; i < timetable.length; i += 1) {
                    if (timetable[i].line === stop.lcode) {
                        timeTableView = new Y.TimeTableView({
                            model: new Y.StopModel({
                                eta: timetable[i].eta,
                                vnum: i + 1
                            })
                        });
                        timeTableView.render();
                    }
                }
            });
        },

        getTimetable: function (stop) {
            if (timer) {
                timer.cancel();
            }

            timer = Y.later(60000, this, Y.DNode.getTimetable,
                [
                    stop.sline,
                    stop.snum,
                    function (timetable) {
                        var i, timeTableView;

                        // console.log(timetable);
                        Y.all('.timeTableViewContainer').remove();
                        for (i = 0; i < timetable.length; i += 1) {
                            timeTableView = new Y.TimeTableView({
                                model: new Y.StopModel({
                                    eta: timetable[i],
                                    vnum: i + 1
                                })
                            });
                            timeTableView.render();
                        }
                    }
                ],
                true
                );
        }
    });

}, '1.0.0', { requires: [
    'view'
]});

