/*global YUI, YUI_config:true */

YUI_config = {
    groups: {
        app: {
            base: 'js/',
            modules: {
                'timetable-view': {
                    path: 'timeTableView.js',
                    requires: [
                        'view',
                        'stylesheet',
                        'datatype',
                        'transition'
                    ]
                },
                'local-storage': {
                    path: 'localStorage.js'
                },
                'stop-model': {
                    path: 'stopModel.js',
                    requires: [
                        'model',
                        'local-storage'
                    ]
                },
                'stopmodel-list': {
                    path: 'stopModelList.js',
                    requires: [
                        'model-list',
                        'stop-model',
                        'local-storage'
                    ]
                },
                'stopsearch-view': {
                    path: 'stopSearchView.js',
                    requires: [
                        'view',
                        'stylesheet',
                        'autocomplete',
                        'autocomplete-highlighters',
                        'datasource',
                        'stopmodel-list'
                    ]
                },
                'trammi': {
                    path: 'trammi.js',
                    requires: [
                        'jsonp',
                        'jsonp-url',
                        'view',
                        'stopsearch-view',
                        'stop-model',
                        'timetable-view'
                    ]
                }
            }
        }
    }
};

YUI().use("trammi", function (Y) {
    'use strict';

    var trammi;

    trammi = new Y.tramMI();
});



