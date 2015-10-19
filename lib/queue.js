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
    var client = new kafka.Client(kOpts.connectionString, kOpts.clientId, kOpts.zkOpts);
    this.producer = new kafka.HighLevelProducer(client);

    var self = this;

    // A promise that resolves only after the 'ready' event fires.
    this.ready = new P(function(resolve, reject) {
        self.producer.on('ready', function(){
            resolve();
            self.logger.log('info/kafka/init', 'kafka producer is ready');
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
    // Use JSON serialization
    batch.messages = batch.messages.map(JSON.stringify);
    // Enable snappy compression
    batch.attributes = 2;
    return this.ready.then(function() {
        self.logger.log('trace/kafka/send', batch);
        return self.producer.sendAsync(batch);
    });
};


/** Returns a Producer implementation based on the configuration. */
function getProducer(params) {
    var type = params.conf.provider.type;
    switch (type) {
    case 'kafka':
        return new KafkaProducer(params);
    default:
        throw new Error('unrecognized provider type \'' + type + '\'');
    }
}


module.exports = {
    getProducer: getProducer
};
