import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';

let app = express();
let port = 8080;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended:true})); // to enable form-urlencoded

app.get('/api/1.1/RestVersion', (req: Request, res: Response, next: NextFunction)=>{
  let payload = {
    version: '1.1'
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

app.get('/api/1.1/ServerTime', (req, res, next)=>{
  let payload = {
    value: moment().format()
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

app.listen(port, ()=>{
  console.log('server started at port=[%d].', port);
});
