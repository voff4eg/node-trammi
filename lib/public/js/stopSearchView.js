/*jslint sloppy:true, unparam:true */
/*global YUI, YAHOO:true */

YUI.add('stopsearch-view', function (Y) {

    Y.StopSearchView = Y.Base.create('stopSearchView', Y.View, [], {

        container: '<input id="stopSearchInput" type="text">' +
            '<label for="stopSearchInput" id="stopSearchLabel">' +
            'Scrivi e seleziona il nome della fermata </label>' +
            '(Es. "tram 1" o "arena")',

        initializer: function () {
            var styleSheet = Y.StyleSheet(), oDS, acNode;

            styleSheet.set("#stopSearchLabel", {
                'height': '30px',
                // 'font-size': '20px',
                'margin-top': "30px",
                'margin-bottom': "10px",
                'margin-left': "10px"
            });

            styleSheet.set("#stopSearchInput", {
                'height': '30px',
                'width': '300px',
                'border': '1px solid #a4c3ca',
                'margin-left': 'auto',
                'margin-right': 'auto',
                'margin-top': "30px",
                'margin-bottom': "10px"
            });

            styleSheet.set('.yui3-aclist-list', {
                'max-height': '300px',
                'overflow-y': 'auto'
            });

            if (Y.one('#stopSearchInput') === null) {
                Y.one('.container').append(this.container);
            }

            acNode = Y.one('#stopSearchInput');

            Y.DNode.getStops(function (stops) {
                oDS = new Y.DataSource.Local({
                    source: stops
                });
                oDS.plug(Y.Plugin.DataSourceJSONSchema, {
                    schema: {
                        resultFields: [
                            "sdescr",
                            "scode",
                            "snum",
                            "sline",
                            "lcode"
                        ]
                    }
                });

                acNode.plug(Y.Plugin.AutoComplete, {
                    maxResults: 100,
                    activateFirstItem: true,
                    resultTextLocator: 'sdescr',
                    source: oDS,
                    resultFilters: 'subWordMatch',
                    resultHighlighter: 'subWordMatch',
                    scrollIntoView: true,
                    width: 'auto'
                });

                acNode.ac.on('select', function (e) {
                    Y.fire('get-stopinfo', e.result.raw);
                    Y.fire('get-timetable', e.result.raw);
                });

                acNode.ac.after('resultsChange', function () {
                    var newWidth = this.get('boundingBox').get('offsetWidth');

                    acNode.setStyle('width', Math.max(newWidth, 300));
                });

                acNode.focus();
            });

        },

        render: function () {
            return this;
        }
    });

}, '1.0.0', { requires: [
    'view',
    'stylesheet',
    'autocomplete',
    'autocomplete-filters',
    'autocomplete-highlighters',
    'datasource'
]});



