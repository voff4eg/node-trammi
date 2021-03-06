YUI.add('timetable-view', function (Y) {
    'use strict';

    Y.TimeTableView = Y.Base.create('timeTableView', Y.View, [], {

        container: Y.one('#timeTableContainer'),

        template: '<ul class="inline" title="Dati estratti alle {now}">' +
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
                now = new Date(),
                when,
                hh,
                mm,
                nodes,
                v = [],
                i;

            pnums = pnums[0] === undefined ? [snum] : pnums;

            for (i = 0; i < pnums.length; i += 1) {
                eta = parseInt(etas[i], 10);
                if (!isFinite(eta)) {
                    when = '?';
                    eta = etas[i];
                } else {
                    when = new Date(now.getTime() + (eta * 60 * 1000));
                    hh = when.getHours();
                    mm = when.getMinutes();
                    hh = hh < 10 ? '0' + hh : hh;
                    mm = mm < 10 ? '0' + mm : mm;
                    when = hh + ':' + mm;
                    eta = eta > 1 ? eta + ' minuti' :  eta + ' minuto';
                }

                v[i] = '<li>' +
                    '<strong>' + eta + '</strong>' +
                    '&nbsp' +
                    '<em>(' + when + ')</em>' +
                    '</li>';
            }

            this.container.append(Y.Lang.sub(this.template, {
                eta: v.join(''),
                sdescr: sdescr,
                now: Y.DataType.Date.format(new Date(), {format: '%H:%M'})
            }));

            nodes = Y.all('#timeTableContainer li');
            nodes.each(function (el, index) {
                el.transition({
                    opacity: {
                        delay: 20 / (index + 1),
                        duration: 100 / (index + 1),
                        value: 0.15
                    }
                }, function () {
                    el.remove();
                });
            });

            return this;
        }
    });

}, '1.0.0', { requires: [
    'view',
    'stylesheet',
    'datatype',
    'transition'
]});




