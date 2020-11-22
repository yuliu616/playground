'use strict';

let Stomp = require('stomp-client');
let moment = require('moment');

let jmsServerConfig = {
  host: '127.0.0.1',
  port: 61613,
  user: 'user',
  password: 'pass'
};

let jmsDestination = '/queue/helloQueue';
// let jmsDestination = '/queue/helloTopic';

let repeatCount = 10;
let isForever = false;
if (process.argv[2] == 'inf') {
  isForever = true;
}
if (process.argv[2] && +(process.argv[2]) > 0) {
  repeatCount = +process.argv[2];
}

let stompClient = new Stomp(
  jmsServerConfig.host, jmsServerConfig.port, 
  jmsServerConfig.user, jmsServerConfig.password);

let doSendMessage = (i)=>{
  let payload = {
    i: i,
    testingTime: moment().format(),
    sentence: 'i am testing this.'
  };

  console.log('send out something i=[%d].', i);
  stompClient.publish(jmsDestination, JSON.stringify(payload));
};

let mainFlow = ()=>{

  if (isForever) {
    let i=0;
    while (true) {
      doSendMessage(i++);
    }
  } else {
    let startTime = moment();
    for (let i=0;i<repeatCount;i++) {
      doSendMessage(i);  
    }
    let endTime = moment();
    if (endTime.diff(startTime, 'second') < 1) {
      console.log('bye, lapsed time: %d ms.', endTime.diff(startTime, 'millisecond'));
    } else {
      console.log('bye, lapsed time: %d s.', endTime.diff(startTime, 'second'));
    }
  }

};

stompClient.on('connect', (sessionId)=>{
  mainFlow();
});

stompClient.on('error', (err)=>{
  console.error('jms error: ', err);
});

console.log('connecting to jms server ...');
stompClient.connect(()=>{
  console.log('connecting to jms server ... done.');
}, (err)=>{
  console.error('error connecting to jms server: ', err);
});
