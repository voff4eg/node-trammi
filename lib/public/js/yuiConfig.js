/*jslint sloppy:true */
/*global YUI, YUI_config:true, DNode */

YUI_config = {
    // filter: "debug",
    groups: {
        app: {
            base: 'js/',
            modules: {
                'statusline-view': {
                    path: 'statusLineView.js',
                    requires: [
                        'view',
                        'stylesheet'
                    ]
                },
                'timetable-view': {
                    path: 'timeTableView.js',
                    requires: [
                        'view',
                        'stylesheet',
                        'datatype'
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
                'stop-view': {
                    path: 'stopView.js',
                    requires: [
                        'view',
                        'stylesheet'
                    ]
                },
                'stopsearch-view': {
                    path: 'stopSearchView.js',
                    requires: [
                        'view',
                        'stylesheet',
                        'autocomplete',
                        'autocomplete-filters',
                        'autocomplete-highlighters',
                        'datasource'
                    ]
                },
                'trammi': {
                    path: 'trammi.js',
                    requires: [
                        'view',
                        'stopsearch-view',
                        'stop-view',
                        'stop-model',
                        'timetable-view',
                        'statusline-view'
                    ]
                }
            }
        },
        dnode: {
            modules: {
                'dnode': {
                    fullpath: '/dnode.js'
                }
            }
        }
    }
};

YUI().use("dnode", "trammi", function (Y) {
    DNode.connect(function (remote) {
        var trammi;

        Y.DNode = remote;
        trammi = new Y.tramMI();
    });
});



