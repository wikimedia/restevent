'use strict';

var P = require('bluebird');
var ajv = require('ajv')();
var fs = P.promisifyAll(require('fs'));
var path = require('path');
var preq = require('preq');


/** @const */
var SCHEMA_REPO = path.join(__dirname, '../schemas');


function schemaPath(schema) {
    return path.join(SCHEMA_REPO, schema.toLowerCase() + '.js');
}

/**
 * Return a schema object from the registry for a given topic.
 */
function loadSchema(schema) {
    if (/^https?:\/\//.test(schema)) {
        return preq.get(schema)
        .then(function(res) {
            return res.body;
        });
    } else {
        return fs.readFileAsync(schemaPath(schema))
        .then(function(json) {
            return JSON.parse(json);
        });
    }
}

/**
 * Return a validator function for our schemas.
 */
function createValidators(topics) {
    var validators = {};

    return P.each(Object.keys(topics), function(name) {
        var topic = topics[name] || {};
        // Fall back to the topic name
        return loadSchema(topic.schema || name)
        .then(function(schemaObj) {
            validators[name] = ajv.compile(schemaObj);
        });
    })
    .then(function() { return validators; });
}


module.exports = {
    createValidators: createValidators,
};
