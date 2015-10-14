'use strict';

var P      = require('bluebird');
var avj    = require('ajv');
var fs     = P.promisifyAll(require('fs'));
var path   = require('path');


/** @const */
var SCHEMA_REPO = path.join(__dirname, '../schemas');


function schemaPath(topic) {
    return path.join(SCHEMA_REPO, topic.toLowerCase() + '.js');
}

/**
 * Return a schema object from the registry for a given topic.
 */
function schemaObj(topic) {
    return fs.readFileAsync(schemaPath(topic))
    .then(function(json) {
        return JSON.parse(json);
    });
}

/**
 * Return a validator function for our schemas.
 */
function createValidator(topics) {
    // XXX: validate that topics is an array
    var v = avj();
 
    return P.each(topics, function(topic) {
        return schemaObj(topic).then(function(obj) {
            v.addSchema(obj, topic);
        });
    })
    .then(function() { return v; });
}


module.exports = {
    createValidator: createValidator,
};
