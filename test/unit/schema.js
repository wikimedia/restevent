'use strict';

// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */


var P       = require('bluebird');
var assert  = require('assert');
var schema  = require('../../lib/schema');


describe('Schema validation', function() {
    it('validates conformant objects', function() {
        var messages = [
            {'url': 'http://localhost', 'type': 'unit'},
            {'url': 'http://localhost', 'type': 'unit', 'details': 'house fav'},
        ];

        return schema.createValidator(['example'])
        .then(function(v) {
            messages.forEach(function(msg, idx) {
                assert(v.validate('example', msg), 'schema is invalid (index ' + idx + ')');
            });
        });
    });

    it('invalidates non-conformant objects', function() {
        var messages = [
            { 'url': 'http://localhost', 'type': 'unit', 'details': 5 },
            { 'url': 'http://localhost', 'details': 'house fav' },
            { 'type': 'unit', 'details': 'house fav' },
        ];

        return schema.createValidator(['example'])
        .then(function(v) {
            messages.forEach(function(msg, idx) {
                assert(!v.validate('example', msg), 'erroneous validation (index ' + idx + ')');
            });
        });
    });
});
