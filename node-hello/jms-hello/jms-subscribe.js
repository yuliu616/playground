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


let stompClient = new Stomp(
  jmsServerConfig.host, jmsServerConfig.port, 
  jmsServerConfig.user, jmsServerConfig.password);

let counter = 0;
let onJmsMessageReceived = (payload)=>{
  counter++;
  console.log('['+moment().format()+']['+counter+'] i got some message, payload=[', payload, ']');
};

stompClient.on('connect', (sessionId)=>{
  stompClient.subscribe(jmsDestination, onJmsMessageReceived);
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
