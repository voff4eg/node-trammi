/*jslint sloppy:true */
/*global YUI */

YUI.add('stopsearch-view', function (Y) {

    Y.StopSearchView = Y.Base.create('stopSearchView', Y.View, [], {

        container: Y.one('#stopSearchContainer'),

        template: '<div class="controls">' +
            '<div class="input-prepend">' +
            '<span class="add-on"><i class="icon-search"></i></span>' +
            '<input id="stopSearchInput" type="text">' +
            '</div>' +
            '</div>',

        initializer: function () {
            var styleSheet = Y.StyleSheet(),
                acNode,
                mainStopList = new Y.StopModelList(),
                descr;

            if (Y.one('#stopSearchInput') === null) {
                this.container.append(this.template);
            }

            styleSheet.set("#stopSearchInput", {
                'width': '400px',
                'marginBottom': '0px'
            });

            styleSheet.set('.yui3-aclist-list', {
                'maxHeight': '300px',
                'overflowY': 'auto'
            });

            styleSheet.set('.yui3-aclist-item-active', {
                'background': '#f5f5f5'
            });

            acNode = Y.one('#stopSearchInput');

            acNode.plug(Y.Plugin.AutoComplete, {
                maxResults: 100,
                activateFirstItem: true,
                resultTextLocator: 'acdescr',
                source: '/trammi/getStops?q={query}&callback={callback}',
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

            mainStopList.load();

            if (mainStopList.size() > 1) {
                // Delete all the history of stops selected, but last one.
                mainStopList.item(0).destroy({'delete': true});
            }

            if (mainStopList.size() !== 0) {
                descr = mainStopList.item(0).get('acdescr');
                acNode.set('value', descr);
                acNode.ac.sendRequest(descr);
            }
        },

        render: function () {
            return this;
        }
    });

}, '1.0.0', { requires: [
    'view',
    'stylesheet',
    'autocomplete',
    'autocomplete-highlighters',
    'datasource',
    'stopmodel-list'
]});



