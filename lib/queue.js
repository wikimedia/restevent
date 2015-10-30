"use strict";


var P     = require('bluebird');
var util  = require('util');


// XXX: These interfaces are fairly Kafka-cetric and will require more thought.


/**
 * The base class for Producer implementations.
 *
 * @param {object} params; the parameters needed to instantiate a Producer
 * @constructor
 */
function Producer(params) {
    this.conf = params.conf;
    this.logger = params.logger;
}

/**
 * Send a list of messages to the underlying queue.
 *
 * Each item in {messages} is an object that represents the destination topic,
 * and one or messages to queue.  For example:
 *
 * @example
 * [
 *   {
 *     topic:       'topicName',
 *     messages:    [ msg, msg, ... ],
 *     partition:   0,
 *     attributes:  2
 *   },
 *   ...
 * ]
 *
 * @param   {array} messages; the list of messages to send to the queue
 * @return {object} a promise that resolves to the status of the send
 */
Producer.prototype.send = function(messages) {
    throw new Error('not implemented; you must override Producer#send');
};

/**
 * Producer implementation based on Kafka.
 *
 * @extends {Producer}
 * @constructor
 */
function KafkaProducer(params) {
    Producer.call(this, params);

    var kOpts = {};
    var host = this.conf.provider.host || 'localhost';
    var port = this.conf.provider.port || 2181;
    kOpts.connectionString = host + ':' + port;
    kOpts.clientId = this.conf.client || "surge";
    kOpts.zkOpts = {}; // Zookeeper connection options (see: http://git.io/vCKRh)

    var kafka = P.promisifyAll(require('kafka-node'));
    this.client = new kafka.Client(kOpts.connectionString, kOpts.clientId, kOpts.zkOpts);
    this.producer = new kafka.HighLevelProducer(this.client);

    var self = this;

    // A promise that resolves only after the 'ready' event fires.
    this.ready = new P(function(resolve, reject) {
        var isConnected = false;
        var isReady = false;
        function canProceed() {
            if (isConnected && isReady) {
                self.logger.log('info/kafka/init', 'kafka producer is ready');
                isConnected = isReady = false;
                resolve();
            }
        }
        self.client.on('connect', function() {
            isConnected = true;
            canProceed();
        });
        self.producer.on('ready', function() {
            isReady = true;
            canProceed();
        });
    });

    // log any error events
    this.producer.on('error', function(errMsg) {
        self.logger.log('error/kafka', errMsg);
    });
}

util.inherits(KafkaProducer, Producer);

/** @inheritdoc */
KafkaProducer.prototype.send = function(batch) {
    var self = this;
    if (!Array.isArray(batch)) {
        batch = [batch];
    }
    batch = batch.map(function(msg) {
        return {
            topic: msg.topic,
            // Use JSON serialization
            messages: msg.messages.map(JSON.stringify),
            // Enable snappy compression
            attributes: 2
        };
    });
    return self.producer.sendAsync(batch);
};


/** Returns a Producer implementation based on the configuration. */
function getProducer(params) {
    var type = params.conf.provider.type;
    switch (type) {
    case 'kafka':
        var kafkaProd = new KafkaProducer(params);
        return kafkaProd.ready.then(function() {
            return kafkaProd;
        });
    default:
        throw new Error('unrecognized provider type \'' + type + '\'');
    }
}


module.exports = {
    getProducer: getProducer
};
