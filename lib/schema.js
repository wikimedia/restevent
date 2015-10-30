'use strict';

var P = require('bluebird');
var ajv = require('ajv')();
var fs = P.promisifyAll(require('fs'));
var path = require('path');
var preq = require('preq');
var yaml = require('js-yaml');


/** @const */
var SCHEMA_REPO = path.join(__dirname, '../schemas');


function schemaPath(schema, ext) {
    ext = ext || 'json';
    return path.join(SCHEMA_REPO, schema.toLowerCase() + '.' + ext);
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
        return fs.readFileAsync(schemaPath(schema, 'json'))
        .then(function(json) {
            return JSON.parse(json);
        }, function() {
            return fs.readFileAsync(schemaPath(schema, 'yaml'))
            .then(function(yamlDef) {
                return yaml.safeLoad(yamlDef);
            });
        });
    }
}

/**
 * Gets the schema definitions and their validator functions
 *
 * @param {object} topics; the object containing the topics to get as keys
 */
function getSchemas(topics) {
    var schemas = {};

    return P.each(Object.keys(topics), function(name) {
        var topic = topics[name] || {};
        // Fall back to the topic name
        return loadSchema(topic.schema || name)
        .then(function(schemaObj) {
            schemas[name] = {
                definition: schemaObj,
                validator: ajv.compile(schemaObj)
            };
        });
    })
    .then(function() { return schemas; });
}


module.exports = {
    getSchemas: getSchemas
};
