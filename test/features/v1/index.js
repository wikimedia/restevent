'use strict';


// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */


var preq   = require('preq');
var assert = require('../../utils/assert.js');
var server = require('../../utils/server.js');


describe('stub', function() {

    this.timeout(20000);

    before(function () { return server.start(); });

    it('should implement an actual test', function() {

    });

});

