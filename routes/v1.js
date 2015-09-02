'use strict';


var P = require('bluebird');
var preq = require('preq');
var domino = require('domino');
var sUtil = require('../lib/util');
var kafka = P.promisifyAll(require('kafka-node'));
var HighLevelProducer = kafka.HighLevelProducer;
var KeyedMessage = kafka.KeyedMessage;

var options = {
    connectionString: undefined, //"kafka-event-bus.services.eqiad.wmflabs:2181/kafka/kafka-event-bus",
    clientId: 0
};

var client = new kafka.Client(options.connectionString,
        options.clientId, options);
var producer = new HighLevelProducer(client);

producer.on('ready', console.log);

producer.on('error', console.log)


// shortcut
var HTTPError = sUtil.HTTPError;

/**
 * The main router object
 */
var router = sUtil.router();

/**
 * The main application object reported when this module is require()d
 */
var app;



var exampleSchema = {
	"title": "Example Schema",
	"type": "object",
	"properties": {
		"url": {
			"type": "string"
		},
		"type": {
			"type": "string"
		},
		"details": {
			"type": "string"
		}
	},
	"required": ["url", "name"]
};

var ajv = require('ajv')();
// add each validator
var validateMessage = ajv.compile(exampleSchema);


/**
 * PUT /topics/{name}
 * Create / update a topic. Accepts a JSON schema.
 */
router.put('/topics/:name', function(req, res) {
    producer.createTopics([req.params.name]);
    res.end(200);
});
/*
 * Expected layout
 * {
 *    topic: 'topicName',
 *    messages: ['message body'],// multi messages should be a array, single message can be just a string or a KeyedMessage instance
 *    // These might be best controlled by the proxy
 *    partition: 0, //default 0
 *    attributes: 2, // default: 0
 * }
 */

function validateMessages(topic, messages) {
    messages = messages.map(function(msg) {
        validateMessage(msg);
        return JSON.stringify(msg);
    });
    return {
        topic: topic,
        messages: messages,
        attributes: 2, // snappy compression
    };
}


/**
 * POST /topics/{name}/
 * Enqueue one or more events. Each event needs to conform to the JSON schema
 * associated with this topic.
 */
router.get('/topics/:name', function(req, res) {
    return P.try(function() {
        var message = validateMessages(req.params.name, req.body);
        return producer.sendAsync([message]);
    });
});


module.exports = function(appObj) {

    app = appObj;

    return {
        path: '/',
        api_version: 1,
        router: router
    };

};

