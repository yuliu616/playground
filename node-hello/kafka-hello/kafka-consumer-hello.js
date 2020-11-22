'use strict';

let kafka = require('kafka-node');

let kafkaClient = new kafka.KafkaClient({
  kafkaHost: '127.0.0.1:9092',
  connectTimeout: 3000,
  autoConnect: true
});

let consumer = new kafka.Consumer(kafkaClient, [{
  topic: 'test',
  offset: 0,
  partition: 0
}], {
  autoCommit: true
});

consumer.on('error', (err)=>{
  console.error(`consumer got error: `, err);
});

consumer.on('message', (payload)=>{
  console.log(`consumer got message: `, payload);
});

setTimeout(()=>{
  console.log('time up, close it.');
  kafkaClient.close(()=>{
    console.log('consumer: closed');
  });
}, 12000);
