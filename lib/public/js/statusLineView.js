/*jslint sloppy:true */
/*global YUI */

YUI.add('statusline-view', function (Y) {

    Y.StopView = Y.Base.create('statusLineView', Y.View, [], {

        container: '<div id="statusLine"></div>',

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




