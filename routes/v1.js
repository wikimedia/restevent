'use strict';

var P = require('bluebird');
var sUtil = require('../lib/util');


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

/*
 * Expected layout
 * {
 *    topic: 'topicName',
 *    messages: ['message body'],// multi messages should be a array, single message can be just a string or a KeyedMessage instance
 * }
 */
function validateMessages(topic, messages) {
    // Check if we have a validator for this topic
    var validate = app.schemas[topic] && app.schemas[topic].validator;
    if (!validate) {
        throw new HTTPError({
            status: 400,
            body: {
                type: 'invalid_topic',
                topic: topic,
                messages: messages
            }
        });
    }

    // We have a validator for this topic. Validate the messages.
    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    messages = messages.map(function(msg) {
        if (!validate(msg)) {
            throw new HTTPError({
                status: 400,
                type: 'invalid_message',
                original_message: msg,
                detail: validate.errors
            });
        }
        return msg;
    });
    return {
        topic: topic,
        messages: messages
    };
}


/**
 * GET /v1/topics/
 * Gets the list of available topics to post to
 */
router.get('/v1/topics/', function(req, res) {

    var schemaList = Object.keys(app.schemas);

    if (!schemaList.length) {
        throw new HTTPError({
            status: 404,
            type: 'not_found',
            title: 'No topic',
            detail: 'No topic has been defined'
        });
    }

    res.status(200).json({ items: schemaList }).end();

});


/**
 * GET /v1/topics/{name}
 * Gets the schema associated with a topic
 */
router.get('/v1/topics/:name', function(req, res) {

    var topic = req.params.name;

    if (!app.schemas[topic]) {
        throw new HTTPError({
            status: 404,
            type: 'not_found',
            title: 'No such topic',
            detail: 'The topic "' + topic + '" does not exist'
        });
    }

    res.status(200).json(app.schemas[topic].definition).end();

});


/**
 * POST /v1/topics/{name}/
 * Enqueue one or more events. Each event needs to conform to the JSON schema
 * associated with this topic.
 */
router.post('/topics/:name', function(req, res) {
    var message = validateMessages(req.params.name, req.body);
    return app.producer.sendBatch([message])
    .then(function(ret) {
        res.status(200).send('Message enqueued');
    });
});



module.exports = function(appObj) {

    app = appObj;

    return {
        path: '/',
        skip_domain: true,
        router: router
    };
};
