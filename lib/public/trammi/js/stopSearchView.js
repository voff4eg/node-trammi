/*global YUI */

YUI.add('stopsearch-view', function (Y) {
    'use strict';

    Y.StopSearchView = Y.Base.create('stopSearchView', Y.View, [], {

        container: Y.one('#stopSearchContainer'),

        template: '<form class="pure-form">' +
            '<input id="stopSearchInput" class="pure-input-1" type="text">' +
            '</form>',

        initializer: function () {
            var styleSheet = Y.StyleSheet(),
                acNode,
                mainStopList = new Y.StopModelList(),
                descr;

            if (Y.one('#stopSearchInput') === null) {
                this.container.append(this.template);
            }

            styleSheet.set("#stopSearchInput", {
                'marginBottom': '0px'
            });

            styleSheet.set('.yui3-aclist-list', {
                'maxHeight': '300px',
                'overflowY': 'auto'
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



