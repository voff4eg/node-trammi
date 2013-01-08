/*global YUI */

YUI.add('timetable-view', function (Y) {
    'use strict';

    Y.TimeTableView = Y.Base.create('timeTableView', Y.View, [], {

        container: Y.one('#timeTableContainer'),

        template: '<ul title="Dati estratti alle {now}">' +
            '{eta}' +
            '</ul>',

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
                eta,
                v = [],
                i;

            pnums = pnums[0] === undefined ? [snum] : pnums;

            for (i = 0; i < pnums.length; i += 1) {
                eta = parseInt(etas[i], 10);
                if (!isFinite(eta)) {
                    eta = etas[i];
                } else {
                    eta = eta > 1 ? eta + ' minuti' :  eta + ' minuto';
                }

                v[i] = '<li><strong>' + eta + '</strong></li>';
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




