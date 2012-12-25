/*global YUI */

YUI.add('timetable-view', function (Y) {
    'use strict';

    Y.TimeTableView = Y.Base.create('timeTableView', Y.View, [], {

        container: Y.one('#timeTableContainer'),

        template: '<p class="btn-group" ' +
            'title="Dati estratti alle {now}">' +
            '{eta}' +
            '<span class="label label-important">{sdescr}</span>' +
            '</p><br>',

        initializer: function () {
            var styleSheet = Y.StyleSheet();

            styleSheet.set('a.btn', {
                'padding': '5px 5px 6px'
            });

            styleSheet.set('.btn-group + .btn-group', {
                'margin-left': '0'
            });
        },

        render: function () {
            var model = this.get('model'),
                etas = model.get('eta'),
                snum = model.get('snum'),
                pnums = model.get('pnum'),
                sdescr = model.get('sdescr'),
                v = [],
                i;

            pnums = pnums[0] === undefined ? [snum] : pnums;

            v[0] = '<a class="btn">capolinea</a>';
            for (i = 1; i < snum; i += 1) {
                v[i] = '<a class="btn">&nbsp;</a>';
            }
            for (i = 0; i < pnums.length; i += 1) {
                v[pnums[i] - 1] = '<a class="btn"><strong>' +
                    etas[i] +
                    ' <i class="icon-play"></i></strong></a>';
            }

            this.container.append(Y.Lang.sub(this.template, {
                eta: v.join(''),
                sdescr: sdescr,
                now: Y.DataType.Date.format(new Date(), {format: '%H:%M'})
            }));

            return this;
        }
    });

}, '1.0.0', { requires: [
    'view',
    'stylesheet',
    'datatype'
]});




