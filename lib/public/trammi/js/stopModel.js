YUI.add('stop-model', function (Y) {
    'use strict';

    Y.StopModel = Y.Base.create('stopModel', Y.Model, [], {
        sync: Y.LocalStorageSync('stop')
    }, {
        ATTRS: {
            sdescr: {value: ''},
            scode: {value: ''},
            snum: {value: ''},
            pnum: {value: ''},
            sline: {value: ''},
            lcode: {value: ''},
            acdescr: {value: ''},
            eta: {value: ''},
            vnum: {value: ''}
        }
    });

}, '1.0.0', { requires: [
    'model',
    'local-storage'
]});

