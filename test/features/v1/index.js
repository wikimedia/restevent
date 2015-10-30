'use strict';


// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */


var preq   = require('preq');
var assert = require('../../utils/assert.js');
var server = require('../../utils/server.js');


describe('Topic definitions', function() {

    before(function () { return server.start(); });

    it('get topics list', function() {
        return preq.get({
            uri: server.config.uri + 'wwww/v1/topics/'
        }).then(function(res) {
            assert.status(res, 200);
            assert.deepEqual(!!res.body.items, true, 'No items returned!');
        });
    });

    it('get topic schema', function() {
        return preq.get({
            uri: server.config.uri + 'wwww/v1/topics/example'
        }).then(function(res) {
            assert.status(res, 200);
            assert.deepEqual(!!res.body.properties, true);
            assert.deepEqual(!!res.body.title, true);
            assert.deepEqual(!!res.body.required, true);
            assert.deepEqual(!!res.body.type, true);
        });
    });

});

