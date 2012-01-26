/*jslint sloppy:true */
/*global YUI */

YUI.add('timetable-view', function (Y) {

    Y.TimeTableView = Y.Base.create('timeTableView', Y.View, [], {

        container: Y.one("#timeTableContainer"),

        template: '<div class="alert alert-info" ' +
            'title="Dati estratti alle {now}">' +
            'Attesa prevista: <strong>{eta}</strong>' +
            '</div>',
        template2: '<div class="alert alert-info" ' +
            'title="Dati estratti alle {now}">' +
            'Attesa prevista per mezzo {vnum} in <strong>{eta} min.</strong>' +
            '</div>',

        initializer: function () {
            var styleSheet = Y.StyleSheet();

            styleSheet.set(".alert", {
                'margin': '2px'
            });
        },

        render: function () {
            var template, eta;

            eta = parseInt(this.model.get("eta"), 10);
            if (!isFinite(eta)) {
                template = this.template;
                eta = this.model.get("eta");
            } else {
                template = this.template2;
            }

            this.container.append(Y.Lang.sub(template, {
                eta: eta,
                vnum: this.model.get('vnum'),
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




