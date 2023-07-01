import { Kafka, Partitioners, KafkaJSError } from 'kafkajs';
import { default as fs } from 'fs';

let payloadFile = process.argv.length > 2 ? 
  process.argv[2] : 'payload.yaml';
let TOPIC = process.argv.length > 3 ? 
  process.argv[3] : 'test';

let client = new Kafka({
  clientId: 'kafka_nodejs_hello_pub',
  brokers: ['127.0.0.1:9092'],
  connectionTimeout: 3000,
});

let producer = client.producer({
  allowAutoTopicCreation: false,
  createPartitioner: Partitioners.DefaultPartitioner,
});

// read payload data from external file
console.log(`load file for payload data: ${payloadFile}`);
let payloadContent = fs.readFileSync(`./${payloadFile}`, { encoding: 'utf-8' }).toString();
let payload: string[] = [];
let multiDocYamlPattern = /\n---\n/g;
if (multiDocYamlPattern.test(payloadContent)) {
  // for not multi document yaml
  let i = 0;
  let pattern = new RegExp(multiDocYamlPattern);
  while (true) {
    let matched = pattern.exec(payloadContent);
    if (matched) {
      payload.push(payloadContent.substring(i, matched.index));
    } else {
      payload.push(payloadContent.substring(i));
      break;
    }
    i = matched.index + matched[0].length;
  }
} else { // not multi document yaml
  payload.push(payloadContent);
}

let sentCount = 0;
async function main(): Promise<any>{

  producer.on('producer.connect', (event)=>{
    console.log(new Date().toISOString(), 
      `producer.connect[topic=${TOPIC}]:`, event.timestamp);
  });
  producer.on('producer.disconnect', (event)=>{
    console.log(new Date().toISOString(), 
      'producer.disconnect:', event.timestamp);
  });
  producer.on('producer.network.request_timeout', (event)=>{
    console.log(new Date().toISOString(), 
      'request_timeout:', event.timestamp);
  });

  await producer.connect();

  for (var it of payload) {
    // console.log('publish payload:', it);
    let meta = await producer.send({
      topic: TOPIC,
      messages: [
        { value: it },
      ]
    });
    for (var m of meta) {
      console.log(new Date().toISOString(),
        `message sent [topic=${m.topicName}][offset=${m.baseOffset}].`);
    }
    sentCount++;
  }
  
  await producer.disconnect();
  console.log(new Date().toISOString(), 'done');
}

main().then(()=>{
  console.log(new Date().toISOString(), 
    `routine done. sentCount=${sentCount}.`);
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