# ~~restevent~~ surge
Prototype REST event bus service

## Configuration
At a minimum, you need to configure the `provider` section for your Kafka broker:

    [ ... ]
    
    provider:
      type: kafka
      host: 192.168.122.64
      port: 2181

## Run
    $ npm install
    $ ./server.js | node_modules/.bin/bunyan

## Interface

- `/topics/{topic}/`
    - POST: add new event


