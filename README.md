# ~~restevent~~ surge
Prototype REST event bus service

## Configuration
At a minimum, you need to configure the `provider` section for your Kafka broker:

    [ ... ]
    
    provider:
      type: kafka
      host: 192.168.122.64
      port: 2181

*Note: Kafka needs to be configured with `auto.create.topics.enable=true`.*

## Run
    $ npm install
    $ ./server.js | node_modules/.bin/bunyan

## Try
    $ curl -D - -X POST -H "Content-Type: application/json" -d '[{ "url": "https://en.wp.org", "type": "fav" }]' \
          http://localhost:6927/en.wikipedia.org/v1/topics/example; echo

## Interface

- `/topics/{topic}/`
    - POST: add new event


