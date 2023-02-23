import { WebSocket, RawData as ws_RawData } from 'ws';

let AUTO_QUIT_TIMEOUT = (+process.env.AUTO_QUIT) || 12000;

const serverUrl = 'ws://127.0.0.1:8080/ws/1.0/luckyDrawChannel';
let ws = new WebSocket(serverUrl, {
  headers: {
    "authorization": "Bearer YOUR_BOSS"
  }
});

// if connection rejected by server, 
// this callback will be triggered.
ws.on('unexpected-response', function(req, res){
  console.error(`${new Date().toISOString()} unexpected-response occurred`, 
    res.statusCode);
});

ws.on('error', function(err){
  console.error(`${new Date().toISOString()} error occurred`, err);
});

ws.on('open', function(){
  console.log(`${new Date().toISOString()} someone open with ws.`);
});

ws.on('close', function(code: number, reason: Buffer){
  console.log(`${new Date().toISOString()} someone close with ws.`,
    'code =', code, 'reason =', reason.toString('utf-8'));
});

// for ping-pong approach (good to keep alive)
ws.on('ping', function(data: Buffer){
  console.log(`${new Date().toISOString()} ws got a PING message:`, 
  data.toString('utf-8'));
});

// for ping-pong approach (good to keep alive)
ws.on('pong', function(data: Buffer){
  console.log(`${new Date().toISOString()} ws got a PONG message:`, 
  data.toString('utf-8'));
});

ws.on('message', function(data: ws_RawData, isBinary: boolean){
  if (isBinary) {
    console.log(`${new Date().toISOString()} ws received data:`, 
      data);
  } else { // not isBinary means the encoded data is not binary, but it is still encoded as Buffer
    // just assume data is a UTF-8 encoded string
    let decoded = data.toString('utf-8');
    console.log(`${new Date().toISOString()} ws received data(decoded):`, 
      decoded);
  }
});

let repeatingJob = setInterval(function(){
  ws.send('hello, i am a ws client. the time is now: '+new Date().toISOString());
  console.log(`${new Date().toISOString()} .`);
}, 1000);

let pingJob = setInterval(function(){
  ws.ping();
}, 5000);

setTimeout(function(){
  ws.send('bye bye lor, '+new Date().toISOString());
  console.log(`${new Date().toISOString()} .`);
  clearInterval(repeatingJob);
  clearInterval(pingJob);
  ws.close();
}, AUTO_QUIT_TIMEOUT);

console.log(`${new Date().toISOString()} client ready`);
