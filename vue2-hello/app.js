let express = require('express');
let bodyParser = require('body-parser');
let moment = require('moment');

let app = express();
let port = 8080;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended:true})); // to enable form-urlencoded
app.use(express.static('client'));

app.get('/api/1.1/ServerTime', (req, res, next)=>{
  let payload = {
    value: moment().format()
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

app.post('/api/1.1/echo', (req,res,next)=>{
  console.log('echo got payload:', req.body);
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(req.body));
});

app.post('/api/1.1/random', (req,res,next)=>{
  console.log('random got payload:', req.body);
  res.append('Content-Type', 'application/json');
  if (Math.random() > 0.5) {
    res.end(JSON.stringify({
      ok: 'good'
    })); 
  } else {
    res.status(400).end(JSON.stringify({
      ok: 'bad'
    })); 
  }
});

app.listen(port, ()=>{
  console.log('server started at port=[%d].', port);
});
