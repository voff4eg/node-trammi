/*jslint sloppy:true */
/*global YUI */

YUI.add('timetable-view', function (Y) {

    Y.TimeTableView = Y.Base.create('timeTableView', Y.View, [], {

        container: Y.one("#timeTableContainer"),

        template: '<div class="btn-group" ' +
            'title="Dati estratti alle {now}">' +
            '<a class="btn" href="#">capolinea</a>' +
            '{eta}' +
            '<span class="label label-important">{sdescr}</span>' +
            '</div>',

        initializer: function () {
            var styleSheet = Y.StyleSheet();

            styleSheet.set("a.btn", {
                'padding': '5px 5px 6px'
            });

            styleSheet.set(".btn-group + .btn-group", {
                'margin-left': '0'
            });
        },

        render: function () {
            var eta = this.model.get("eta"),
                snum = this.model.get("snum"),
                pnum = this.model.get("pnum") || snum,
                sdescr = this.model.get("sdescr"),
                v = "",
                i;

            eta = parseInt(eta, 10);
            if (!isFinite(eta)) {
                eta = this.model.get("eta");
            }

            for (i = 1; i < pnum - 1; i += 1) {
                v += '<a class="btn" href="#">&nbsp;</a>';
            }
            v += '<a class="btn" href="#"><strong>' +
                eta +
                ' min. >>></strong></a>';
            for (i = pnum + 1; i <= snum; i += 1) {
                v += '<a class="btn" href="#">&nbsp;</a>';
            }

            this.container.append(Y.Lang.sub(this.template, {
                eta: v,
                sdescr: sdescr,
                now: Y.DataType.Date.format(new Date(), {format: "%H:%M"})
            }));

            return this;
        }
    });

}, '1.0.0', { requires: [
    'view',
    'stylesheet',
    'datatype'
]});




