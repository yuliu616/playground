'use strict';

let kafka = require('kafka-node');

/**
 * kafka docker starting command (for your ease)
 
    docker run -d --name zookeeper \
      -p 2181:2181 \
      --network sand-net \
      zookeeper

    docker run -d --name kafka \
      -p 9092:9092 \
      --network sand-net \
      -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
      -e KAFKA_ADVERTISED_HOST_NAME=127.0.0.1 \
      wurstmeister/kafka:latest
 
 */

let kafkaClient = new kafka.KafkaClient({
  kafkaHost: '127.0.0.1:9092',
  connectTimeout: 3000,
  autoConnect: true
});

let producer = new kafka.Producer(kafkaClient, {
  ackTimeoutMs: 10000,
  requireAcks: 1
});

let payloads = [{
  partition: 0,
  topic: 'test',
  messages: `time is now ${new Date().toUTCString()}` // messages could be an array
}];

///////////////

producer.on('error', (err)=>{
  console.error(`producer got error: `, err);
});

producer.on('ready', ()=>{

  producer.send(payloads, (err, data)=>{
    console.log(`message sent. data=`, data);
  });

});

setTimeout(()=>{
  console.log('time up, close it.');
  kafkaClient.close(()=>{
    console.log('producer: closed');
  });
}, 6000);
