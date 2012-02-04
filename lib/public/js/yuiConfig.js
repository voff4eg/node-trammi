/*jslint sloppy:true */
/*global YUI, YUI_config:true, DNode */

YUI_config = {
    // filter: "debug",
    'my-gallery': {
        base: 'gallery-2011.03.11-23-49/',
        modules: {
            'gallery-timer': {
                requires: [
                    'base-build',
                    'event-custom'
                ]
            }
        }
    },
    groups: {
        ie: {
            base: 'js/ie/',
            modules: {
                'ie-support': {
                    path: 'ie-fake.js'
                },
                'es5-shim': {
                    path: 'es5-shim.min.js',
                    condition: {
                        trigger: 'ie-support',
                        test: function (Y) {
                            return Y.UA.ie && Y.UA.ie < 9;
                        },
                        when: "instead"
                    }
                },
                'json2': {
                    path: 'json2.js',
                    condition: {
                        trigger: 'ie-support',
                        test: function (Y) {
                            return Y.UA.ie && Y.UA.ie < 8;
                        },
                        when: "instead"
                    }
                }
            }
        },
        dnode: {
            modules: {
                'dnode': {
                    fullpath: '/dnode.js'
                }
            }
        },
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
                'stopmodel-list': {
                    path: 'stopModelList.js',
                    requires: [
                        'model-list',
                        'stop-model',
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
                        'autocomplete-highlighters',
                        'datasource',
                        'stopmodel-list'
                    ]
                },
                'trammi': {
                    path: 'trammi.js',
                    requires: [
                        'ie-support',
                        'dnode',
                        'view',
                        'stylesheet',
                        'stopsearch-view',
                        'stop-model',
                        'timetable-view',
                        'gallery-timer'
                    ]
                }
            }
        }
    }
};

YUI().use("trammi", function (Y) {
    DNode.connect(function (remote) {
        var trammi;

        Y.DNode = remote;
        trammi = new Y.tramMI();
    });
});



