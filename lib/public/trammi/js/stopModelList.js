/*jslint sloppy:true */
/*global YUI */

YUI.add('stopmodel-list', function (Y) {

    Y.StopModelList = Y.Base.create('stopModelList', Y.ModelList, [], {
        model: Y.StopModel,

        sync : Y.LocalStorageSync('stop')
    });

}, '1.0.0', { requires: [
    'model-list',
    'stop-model',
    'local-storage'
]});

