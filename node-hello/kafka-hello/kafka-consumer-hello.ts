import { Kafka, EachMessagePayload, KafkaJSError } from 'kafkajs';

let PARTITION_ID = 0;
let TOPIC = process.argv.length > 2 ? 
  process.argv[2] : 'test';
let targetOffset = process.argv.length > 3 ? 
  +process.argv[3] : null;

let client = new Kafka({
  clientId: 'kafka_nodejs_hello_cons',
  brokers: ['127.0.0.1:9092'],
  connectionTimeout: 3000,
});

let consumer = client.consumer({
  groupId: 'kafka_nodejs_hello_consumer_group',
});

async function main(): Promise<any>{
  
  consumer.on('consumer.connect', (event)=>{
    console.log(new Date().toISOString(), 
      `consumer.connect[topic=${TOPIC}]:`, event.timestamp);
  });
  // consumer may disconnect, stop, even crash,
  // but it could still auto reconnect and recover itself later.
  consumer.on('consumer.disconnect', (event)=>{
    console.log(new Date().toISOString(), 
      'consumer.disconnect:', event.timestamp);
  });
  consumer.on('consumer.stop', (event)=>{
    console.log(new Date().toISOString(),
      'consumer.stop:', event.timestamp);
  });
  consumer.on('consumer.crash', (event)=>{
    console.log(new Date().toISOString(),
      'consumer.crash:', event.timestamp);
  });
  consumer.on('consumer.group_join', (event)=>{
    console.log(new Date().toISOString(), 
      'consumer.group_join:', event.timestamp);
  });
  consumer.on('consumer.network.request_timeout', (event)=>{
    console.log(new Date().toISOString(), 
      'request_timeout:', event.timestamp);
  });
  
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });
  
  let onMessage = (payload: EachMessagePayload) => {
    let message = payload.message;
    console.log(new Date().toISOString(), 
      `consumer got message. partition=${payload.partition}`);
    console.log(`message[offset=${message.offset}]:`);
    let decoded = message.value?.toString('utf-8');
    if (decoded) {
      console.log('>  '+decoded.replace(/\n/g, '\n>  '));
    } else {
      console.log('>  (undefined)', '\n>  ');
    }
    return Promise.resolve();
  };

  // start 'run' in async
  consumer.run({ autoCommit: true, autoCommitInterval: 500, eachMessage: onMessage });
  // consumer.pause([{ topic: TOPIC }]);
  if (targetOffset) {
    consumer.seek({ 
      topic: TOPIC, 
      partition: PARTITION_ID, 
      offset: targetOffset.toString(),
    });  
  }
  // consumer.resume([{ topic: TOPIC }]);
}

main().then(()=>{
  console.log(new Date().toISOString(), 
    'routine done, wait awhile before shut down.');
  return wait(30_000);
}).then(()=>{
  console.log(new Date().toISOString(), 'wait done.');
  return consumer.disconnect();
}).catch(err=>{
  console.error('error in main.', err);
  let kafkaErr: KafkaJSError = err;
  if (kafkaErr.name == 'KafkaJSNumberOfRetriesExceeded' &&
  kafkaErr.cause?.name == 'KafkaJSConnectionError' &&
  (<any>kafkaErr.cause)?.code == 'ECONNREFUSED')
  {
    console.error('connection error: ECONNREFUSED');
  } else { // other kafkaError
    console.error(`kafka error: ${kafkaErr.name} msg: ${kafkaErr.message}`);
    if (kafkaErr.cause) {
      console.error('cause ='+JSON.stringify(kafkaErr.cause, null, 2));
    }
  }
});

////////////
async function wait(
  timeoutMs: number
): Promise<void> {
  return new Promise((resolve, reject)=>{
    setTimeout(()=>resolve(), timeoutMs);  
  }); 
}