'use strict';

let kafka = require('kafka-node');

let kafkaClient = new kafka.KafkaClient({
  clientId: 'kafka_nodejs_hello_cons',
  kafkaHost: '127.0.0.1:9092',
  connectTimeout: 3000,
  autoConnect: false,
});
let PARTITION_ID = 0;
let TOPIC = process.argv.length > 2 ? process.argv[2] : 'test';
// let targetOffset = null;
let targetOffset = process.argv.length > 3 ? 
  +process.argv[3] : null;
// let targetOffset = 24280;
console.log(`listen to topic: ${TOPIC}, offset=${targetOffset}.`);

let consumer = new kafka.Consumer(kafkaClient, [{
  topic: TOPIC,
  partition: PARTITION_ID,
  offset: targetOffset,
}], {
  autoCommit: true,
  
  // if it is false, 'offset' param (and 'setOffset()') will be ignored.
  // (and it will started from latest)
  // fromOffset: true,
  fromOffset: (targetOffset !== null),
});
// consumer.setOffset(TOPIC, PARTITION_ID, 50);

consumer.on('error', (err)=>{
  console.error(`consumer got error: `, err);
});

consumer.on('offsetOutOfRange', (err)=>{
  console.error(`consumer got offsetOutOfRange: `, err);
});

consumer.on('message', (payload)=>{
  let value = payload.value;
  delete payload.value;
  console.log(new Date().toISOString(), `consumer got message: `, payload);
  console.log(`value:`);
  console.log('>  '+value.replace(/\n/g, '\n>  '));
});

kafkaClient.connect();
setTimeout(()=>{
  console.log('time up, close it.');
  kafkaClient.close(()=>{
    console.log('kafkaClient: closed');
  });
}, 7200000);
