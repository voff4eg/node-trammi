/*jslint sloppy:true, unparam:true */
/*global YUI, YAHOO:true */

YUI.add('stopsearch-view', function (Y) {

    Y.StopSearchView = Y.Base.create('stopSearchView', Y.View, [], {

        container: Y.one('#stopSearchContainer'),

        template: '<input id="stopSearchInput" type="text">',

        initializer: function () {
            var styleSheet = Y.StyleSheet(), oDS, acNode;

            styleSheet.set("#stopSearchInput", {
                'width': '400px'
            });

            styleSheet.set('.yui3-aclist-list', {
                'max-height': '300px',
                'overflow-y': 'auto'
            });

            styleSheet.set('.yui3-aclist-item-active', {
                'background': '#f5f5f5'
            });

            if (Y.one('#stopSearchInput') === null) {
                this.container.append(this.template);
            }

            acNode = Y.one('#stopSearchInput');

            Y.DNode.getStops(function (stops) {
                oDS = new Y.DataSource.Local({
                    source: stops
                });
                oDS.plug(Y.Plugin.DataSourceJSONSchema, {
                    schema: {
                        resultFields: [
                            "acdescr",
                            "sdescr",
                            "scode",
                            "snum",
                            "sline",
                            "lcode",
                            "ltype",
                            "lway"
                        ]
                    }
                });

                acNode.plug(Y.Plugin.AutoComplete, {
                    maxResults: 100,
                    activateFirstItem: true,
                    resultTextLocator: 'acdescr',
                    source: oDS,
                    resultFilters: 'subWordMatch',
                    resultHighlighter: 'subWordMatch',
                    scrollIntoView: true,
                    width: 'auto'
                });

                acNode.ac.on('select', function (e) {
                    Y.fire('get-timetable', e.result.raw);
                });

                acNode.ac.after('resultsChange', function () {
                    var newWidth = this.get('boundingBox').get('offsetWidth');

                    acNode.setStyle('width', Math.max(newWidth, 400));
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



