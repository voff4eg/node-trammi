/*jslint sloppy:true */
/*global YUI */

YUI.add('stop-view', function (Y) {

    Y.StopView = Y.Base.create('stopView', Y.View, [], {

        container: '<div class="stopViewContainer"></div>',

        initializer: function () {
            // var styleSheet = Y.StyleSheet();
        },

        render: function () {
            return this;
        }
    });

}, '1.0.0', { requires: [
    'view',
    'stylesheet'
]});



