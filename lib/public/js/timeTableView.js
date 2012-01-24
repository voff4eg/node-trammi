/*jslint sloppy:true */
/*global YUI */

YUI.add('timetable-view', function (Y) {

    Y.TimeTableView = Y.Base.create('timeTableView', Y.View, [], {

        container: '<div class="timeTableViewContainer"></div>',

        template: '<div>Attesa prevista: {eta}' +
            ' (dati estratti alle {now})</div>',
        template2: '<div>Attesa prevista per mezzo {vnum} in {eta} min.' +
            ' (dati estratti alle {now})</div>',

        initializer: function () {
            var styleSheet = Y.StyleSheet();

            styleSheet.set(".timeTableViewContainer", {
                'font-size': '20px',
                'margin': "10px"
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

            this.container.setContent(Y.Lang.sub(template, {
                eta: eta,
                vnum: this.model.get('vnum'),
                now: Y.DataType.Date.format(new Date(), {format: "%H:%M"})
            }));

            Y.one('.container').append(this.container);

            return this;
        }
    });

}, '1.0.0', { requires: [
    'view',
    'stylesheet',
    'datatype'
]});




