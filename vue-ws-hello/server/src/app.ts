import * as moment from 'moment';
import * as express from 'express';

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

let port = 8080;
const APP_NAME = 'vue-ws-hello-server';
const API_VERSION = '1.0';
const VERSION_DESCRIPTION = 'express app for ws demo';
let serverInstanceRandId = 1000+Math.floor(16000 * Math.random());

function timeStr(): string {
  return moment().format();
}

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

app.listen(port, ()=>{
  console.log(timeStr(), `express-app served at port[${port}].`);
});
