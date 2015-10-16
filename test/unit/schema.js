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

        return schema.createValidators({ example: { schema: 'example' } })
        .then(function(v) {
            messages.forEach(function(msg, idx) {
                assert(v.example(msg), 'schema is invalid (index ' + idx + ')');
            });
        });
    });

    it('invalidates non-conformant objects', function() {
        var messages = [
            { 'url': 'http://localhost', 'type': 'unit', 'details': 5 },
            { 'url': 'http://localhost', 'details': 'house fav' },
            { 'type': 'unit', 'details': 'house fav' },
        ];

        return schema.createValidators({ example: {} })
        .then(function(v) {
            messages.forEach(function(msg, idx) {
                assert(!v.example(msg), 'erroneous validation (index ' + idx + ')');
            });
        });
    });
});
