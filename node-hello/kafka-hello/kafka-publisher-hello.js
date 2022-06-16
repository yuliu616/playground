'use strict';

let kafka = require('kafka-node');

/**
 * kafka docker starting command (for your ease)

    # or, use a real ip of your network card
    YOUR_IP=127.0.0.1
    YOUR_VM_NET=my-net

    docker run -d --name zookeeper \
      -e ZOOKEEPER_CLIENT_PORT=2181 \
      -e ZOOKEEPER_TICK_TIME=2000 \
      -e ZOOKEEPER_SYNC_LIMIT=2 \
      --network ${YOUR_VM_NET} \
      confluentinc/cp-zookeeper:7.0.1

    docker run -d --name kafka \
      --network ${YOUR_VM_NET} \
      -p 9092:9092 \
      -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
      -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://${YOUR_IP}:9092 \
      -e KAFKA_BROKER_ID=2 \
      -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
      confluentinc/cp-kafka:5.2.5-10
 
 */

let echoPayloadOnSending = true;

let kafkaClient = new kafka.KafkaClient({
  kafkaHost: '127.0.0.1:9092',
  connectTimeout: 3000,
  autoConnect: false,
});
let PARTITION_ID = 0;
let TOPIC = 'test';

let producer = new kafka.Producer(kafkaClient, {
  ackTimeoutMs: 10000, // ms
  requireAcks: 1,
});

let payloads = [{
  partition: PARTITION_ID,
  topic: TOPIC,
  messages: `time is now ${new Date().toUTCString()}` // messages could be an array
}];

///////////////

producer.on('error', (err)=>{
  console.error(`producer got error: `, err);
});

let producer_send = payload=>new Promise((resolve, reject)=>{
  if (echoPayloadOnSending) {
    console.log(`sending payload:\n`+payload[0].messages);
  }
  producer.send(payload, (err, res)=>{
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

let client_close = ()=>new Promise((resolve, reject)=>{
  kafkaClient.close(()=>{
    resolve();
  });
});

kafkaClient.connect();
producer.on('ready', ()=>{

  Promise.resolve(null).then(()=>{ // empty promise to make the syntax pretty.
    console.log(new Date().toISOString(), `producer ready.`);
    return producer_send(payloads);
  }).then(res=>{
    console.log(new Date().toISOString(), `message sent. res=`, res);
    return client_close();
  }).then(()=>{
    console.log(new Date().toISOString(), 'kafkaClient: closed.');
  }).catch(err=>{
    console.error(err);
  });

});
