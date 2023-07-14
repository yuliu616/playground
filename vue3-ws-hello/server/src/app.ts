import * as http from 'http';
import * as moment from 'moment';
import * as express from 'express';
import ws, { WebSocketServer } from 'ws';

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// parameters (hardcoded)
let port = 8080;
let DEBUG = +process.env.DEBUG;
const APP_NAME = 'vue-ws-hello-server';
const API_VERSION = '1.0';
const VERSION_DESCRIPTION = 'express app for ws demo';
const serverInstanceRandId = 1000+Math.floor(16000 * Math.random());
const options = {
  luckyDraw: {
    minForTicket: 1, // must be 1+
    maxForTicket: 16,
    timeForOneRoundMs: 1000,
  },
  ws: {
    broadcastKeepAliveIntervalMs: 15000, // 0 for disabled.
  },
};

function timeStr(): string {
  return moment().format();
}

let server: http.Server;
let wsContext = {
  clientIdList: <number[]>[],
  clientIdOfClient: new Map<number, ws.WebSocket>(),
  userInfoMap: <[number: UserInfo]>{},
  luckyDraw: {
    startTime: <Date>null,
    ticketList: <number[]>[],
    totalContribution: 0.0,
  },
  wsServer: <WebSocketServer>null,
  wsJob: {
    broadcastJob: <NodeJS.Timer>null,
    drawingJob: <NodeJS.Timer>null,
  },
};
let clientIdCounter = 1000;

app.get('/works', (req, res, next)=>{
  res.end('ts-express works!');
  next();
});

app.get(`/api/${API_VERSION}/version`, (req, res, next)=>{
  var now = new Date();
  if (req.query.printLog == 'true' ||
    typeof req.query.printLog == 'undefined') 
  {
    console.log(timeStr(), `healthCheck endpoint invoked.`);
  }

  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify({
    "serviceName": APP_NAME,
    "apiVersion": API_VERSION,
    "apiBaseUrl": `/api/${API_VERSION}`,
    "currentTime": now.toISOString(),
    "currentDate": now.toISOString().substring(0, 10),
    "description": VERSION_DESCRIPTION,
    "instanceRandId": serverInstanceRandId,
  }));
  next();
});

app.get(`/api/${API_VERSION}/time`, (req, res, next)=>{
  var now = new Date();
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify({
    "currentTime": now.toISOString(),
    "currentDate": now.toISOString().substring(0, 10),
  }));
  next();
});

app.get(`/api/${API_VERSION}/luckyDraw/debugging`, (req, res, next)=>{
  if (DEBUG) {
    let clone: any = Object.assign({}, wsContext);
    delete clone.clientIdOfClient;
    delete clone.wsServer;
    delete clone.wsJob;
    clone.clientIdOfClient = {};
    wsContext.clientIdOfClient.forEach((value, key)=>{
      clone.clientIdOfClient[key] = {};
    });
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify(clone));
  } else {
    res.status(400).end();
  }
  next();
});

app.post(`/api/${API_VERSION}/luckyDraw/join`, (req, res, next)=>{
  try {
    if (wsContext.luckyDraw.startTime != null) {
      throw new Error('luckyDraw is already started.');
    } else {
      let personInfo = req.body;
      if (DEBUG) console.log(timeStr(), `someone want to join the luckyDraw:`, personInfo);

      // field validation
      if (!personInfo.clientId || 
        typeof personInfo.clientId != 'number' || 
        (personInfo.clientId as number) == 0)
      {
        throw new Error(`invalid value for clientId field.`);
      } else if (!personInfo.name || 
        typeof personInfo.name != 'string' || 
        (personInfo.name as string).trim() == '')
      {
        throw new Error(`name field must be filled.`);
      } else if (!personInfo.guess || 
        typeof personInfo.guess != 'number' || 
        (personInfo.guess as number) == 0)
      {
        throw new Error(`invalid value for guess field.`);
      } else if (!personInfo.contribution || 
        typeof personInfo.contribution != 'number' || 
        (personInfo.contribution as number) < 0)
      {
        throw new Error(`invalid value for contribution field.`);
      }

      if (wsContext.userInfoMap[personInfo.userId]) {
        throw new Error(`this person[${personInfo.userId}] is already joined.`);
      }

      // validation passed, add this person.
      let clientId: number = personInfo.clientId;
      let contribution: number = +personInfo.contribution;
      wsContext.userInfoMap[clientId] = {
        clientId: clientId,
        name: personInfo.name,
        guess: +personInfo.guess,
        contribution: contribution,
      };
      wsContext.luckyDraw.totalContribution += contribution;
      if (DEBUG) console.log(timeStr(), `someone[${clientId}][${personInfo.name}] joined the luckyDraw with contribution[${contribution}].`);
    }
    
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    res.status(400);
    if (error instanceof Error) {
      res.header('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: error.message }));
    } else {
      res.header('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'unknown error' }));
    }
  }
  next();
});

app.put(`/api/${API_VERSION}/luckyDraw/start`, (req, res, next)=>{
  try {
    if (wsContext.luckyDraw.startTime != null) {
      throw new Error('server already started.');
    } else {
      startDrawing();
    }
    
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    res.status(400);
    if (error instanceof Error) {
      res.header('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: error.message }));
    } else {
      res.header('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'unknown error' }));
    }
  }
  next();
});

app.put(`/api/${API_VERSION}/luckyDraw/stop`, (req, res, next)=>{
  try {
    if (wsContext.luckyDraw.startTime == null) {
      throw new Error('server is not yet started.');
    } else {
      stopDrawing(true);
    }
    
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    res.status(400);
    if (error instanceof Error) {
      res.header('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: error.message }));
    } else {
      res.header('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'unknown error' }));
    }
  }
  next();
});

server = app.listen(port, ()=>{
  console.log(timeStr(), `express-app served at port[${port}].`);
});

setupWsServer();

function setupWsServer(){
  if (DEBUG) console.log(timeStr(), `wsServer start ...`);
  wsContext.wsServer = new WebSocketServer({ 
    server: server,
    // if not provided, any path will do.
    path: `/ws/${API_VERSION}/luckyDrawChannel`,
    maxPayload: 512, // set a reasonable limit.
    perMessageDeflate: {
      clientNoContextTakeover: true,
      serverNoContextTakeover: true,
      serverMaxWindowBits: 10,
      concurrencyLimit: 10,
      threshold: 1024,
    },
    // verifyClient: (info: { origin: string; secure: boolean; req: http.IncomingMessage })=>{
    //   if (DEBUG) console.log(`${new Date().toISOString()} someone try to connect via ws.`);
    //   if (DEBUG) console.log('request:', `[${info.req.method}] ${info.req.url}`);
    //   if (DEBUG) console.log('headers =', info.req.headers);
    //   if (info.req.headers["authorization"] != "Bearer YOUR_BOSS"){
    //     // demo-purpose logic to show how to reject 
    //     // a ws connection request.
    //     if (DEBUG) console.log(`${new Date().toISOString()}`,
    //       `rejecting connection with authorization header:`,
    //       info.req.headers["authorization"]);
    //     return false;
    //   }
    //   return true;
    // },
  });
  if (DEBUG) console.log(timeStr(), `wsServer started.`);
  
  wsContext.wsServer.on('connection', (client)=>{
    let clientId = clientIdCounter++;
    client.on('error', (err)=>onWsError(clientId, err));
    client.on('close', (code, reason)=>onWsClose(clientId, code, reason));
    client.on('ping', (data)=>onWsPing(clientId, data));
    client.on('pong', (data)=>onWsPong(clientId, data));
    client.on('message', (data, isBinary)=>onWsMessage(clientId, data, isBinary));
    
    if (DEBUG) console.log(timeStr(), `ws/client connection created, clientId=${clientId}.`);
    onWsConnected(clientId, client);
  });
}

function onWsConnected(clientId: number, client: ws.WebSocket){
  if (!wsContext.clientIdList.includes(clientId)) {
    wsContext.clientIdList.push(clientId);
    wsContext.clientIdOfClient.set(clientId, client);
  }
  client.send(JSON.stringify(<WsMessage>{
    type: WsMessageType.INIT,
    data: clientId,
  }))
}

function onWsError(clientId: number, err: Error){
  console.error(timeStr(), `c[${clientId}] error occurred`, err);
  if (err.stack) {
    console.error(err.stack);
  }
}

function onWsClose(clientId: number, code: number, reason: Buffer){
  if (DEBUG) console.log(timeStr(), `c[${clientId}] someone close with ws.`,
      'code =', code, 'reason =', reason.toString('utf-8'));
  let found = wsContext.clientIdList.indexOf(clientId);
  if (found >= 0) {
    wsContext.clientIdList.splice(found, 1);
    wsContext.clientIdOfClient.delete(clientId);
  }
}

// for ping-pong approach (good to keep alive)
function onWsPing(clientId: number, data: Buffer){
  if (DEBUG) console.log(timeStr(), `c[${clientId}] ws got a PING message:`, 
    data.toString('utf-8'));
}

// for ping-pong approach (good to keep alive)
function onWsPong(clientId: number, data: Buffer){
  if (DEBUG) console.log(timeStr(), `c[${clientId}] ws got a PONG message:`, 
    data.toString('utf-8'));  
}

function onWsMessage(clientId: number, data: ws.RawData, isBinary: boolean){
  if (isBinary) {
    if (DEBUG) console.log(timeStr(), `c[${clientId}] ws received data:`, 
      data);
  } else { // not isBinary means the encoded data is not binary, but it is still encoded as Buffer
    // just assume data is a UTF-8 encoded string
    let decoded = data.toString('utf-8');
    if (DEBUG) console.log(timeStr(), `c[${clientId}] ws received data(decoded):`, 
      decoded);
  }
}

function broadcastMessage(type: WsMessageType, message: string, data: any = null){
  if (DEBUG) console.log(timeStr(), `broadcastMessage: ${message}`);
  wsContext.wsServer.clients.forEach(client=>{
    client.send(JSON.stringify(<WsMessage>{
      type: type,
      text: message,
      data: data,
    }))
  });
}

function startDrawing(){
  wsContext.luckyDraw.startTime = new Date();
  wsContext.luckyDraw.ticketList = [];
  let userCount = Object.keys(wsContext.userInfoMap).length;
  broadcastMessage(WsMessageType.DRAW_START,
    `luckyDraw started with ${userCount} people `
    +`and total contribution is ${wsContext.luckyDraw.totalContribution}.`
  );

  wsContext.wsJob.drawingJob = setInterval(()=>{
    onDrawing();
  }, options.luckyDraw.timeForOneRoundMs);
}

function stopDrawing(doSendMessage: boolean){
  if (DEBUG) console.log(timeStr(), `on drawing stop: clientIdList =`, wsContext.clientIdList);
  if (DEBUG) console.log(timeStr(), `on drawing stop: userInfoMap =`, wsContext.userInfoMap);
  if (DEBUG) console.log(timeStr(), `on drawing stop: luckyDraw.startTime =`, wsContext.luckyDraw.startTime);
  if (DEBUG) console.log(timeStr(), `on drawing stop: luckyDraw.ticketList =`, wsContext.luckyDraw.ticketList);
  if (DEBUG) console.log(timeStr(), `on drawing stop: luckyDraw.totalContribution =`, wsContext.luckyDraw.totalContribution);
  wsContext.userInfoMap = <any>{};
  wsContext.luckyDraw.startTime = null;
  wsContext.luckyDraw.totalContribution = 0.0;
  clearInterval(wsContext.wsJob.drawingJob);
  if (doSendMessage) {
    broadcastMessage(WsMessageType.ANNOUNCEMENT,
      `luckyDraw stopped `
      +`after ${wsContext.luckyDraw.ticketList.length} round(s) `
      +`of drawing.`
    );  
  }
}

function onDrawing(){
  let justDrawn = Math.floor(Math.random() * 
    (options.luckyDraw.maxForTicket
    - options.luckyDraw.minForTicket)
    ) + options.luckyDraw.minForTicket;
  if (DEBUG) console.log(timeStr(), `onDrawing ... got ${justDrawn}.`);
  wsContext.luckyDraw.ticketList.push(justDrawn);

  let winnerInfo: UserInfo = null;
  for (let clientId of wsContext.clientIdList) {
    let userInfo = wsContext.userInfoMap[clientId];
    if (userInfo && userInfo.guess == justDrawn) {
      winnerInfo = userInfo;
      break;
    }
  }

  broadcastMessage(WsMessageType.DRAW_RESULT,
    `ticket drawn is a ${justDrawn}.`,
    justDrawn);

  if (winnerInfo != null){
    if (DEBUG) console.log(timeStr(), `client[${winnerInfo.clientId}] won.`);

    let winnerClient: ws.WebSocket = null;
    wsContext.clientIdOfClient.forEach((client, cid)=>{
      if (cid == winnerInfo.clientId) {
        winnerClient = client;
      }
    });
    
    for (let client of wsContext.wsServer.clients){
      if (client == winnerClient) {
        client.send(JSON.stringify(<WsMessage>{
          type: WsMessageType.DRAW_END,
          data: {
            ticket: justDrawn,
            winnerInfo: winnerInfo,
          },
          text: 'WOW, you won !!',
        }));
      } else {
        client.send(JSON.stringify(<WsMessage>{
          type: WsMessageType.DRAW_END,
          data: {
            ticket: justDrawn,
            winnerInfo: winnerInfo,
          },
          text: 'someone got the prize !!',
        }));
      }
    }
    stopDrawing(false);
  }
}

if (options.ws.broadcastKeepAliveIntervalMs) {
  wsContext.wsJob.broadcastJob = setInterval(function(){
    if (!wsContext.wsServer) {
      if (DEBUG) console.log(timeStr(), `broadcastJob skipped because wsServer is not yet created.`);
    } else {
      if (DEBUG) console.log(timeStr(), `broadcastJob keepAlive while client count = ${wsContext.wsServer.clients.size}.`);
      broadcastMessage(WsMessageType.ANNOUNCEMENT,
        'hello everybody, the server is still alive.');
    }
  }, options.ws.broadcastKeepAliveIntervalMs);  
}

enum WsMessageType {
  'INIT' = 'INIT',
  'ANNOUNCEMENT'= 'ANNOUNCEMENT',
  'DRAW_START' = 'DRAW_START',
  'DRAW_RESULT' = 'DRAW_RESULT',
  'DRAW_END' = 'DRAW_END',
}

interface WsMessage {
  type: WsMessageType,
  text?: string,
  data?: any,
}

interface UserInfo { 
  clientId: number;
  name: string;
  guess: number;
  contribution: number;
}
