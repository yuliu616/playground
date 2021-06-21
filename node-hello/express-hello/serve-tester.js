let express = require('express');
let moment = require('moment');

let app = express();
let port = 8099;
let debug = (+process.env.debug || process.env.debug === 'true');
let serverRandId = Math.floor(Math.random() * 9000)+1000;

app.use(express.json()); // for parsing post body in json
app.use(express.urlencoded({ extended:true })); // to enable form-urlencoded

app.use(express.static('public'));

let testingData = [
  { id: 101, version: 3, firstName: 'Peter', lastName: 'Wang', gender: 'MALE', },
  { id: 102, version: 1, firstName: 'May', lastName: 'Wu', gender: 'FEMALE', },
  { id: 103, version: 2, firstName: 'Lilian', lastName: 'Xu', gender: 'FEMALE', },
  { id: 104, version: 1, firstName: 'Rose', lastName: 'Li', gender: 'FEMALE', },
  { id: 105, version: 10, firstName: 'John', lastName: 'Li', gender: 'MALE', },
];

app.get('/api/1.0/time', (req, res, next)=>{
  let payload = {
    value: moment().format()
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

// CRUD: list
app.get('/api/1.0/People', (req, res, next)=>{
  let payload = testingData;
  if (+req.query.size > 0) {
    payload = payload.slice(0, +req.query.size);
  }
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

// CRUD: find by id
app.get('/api/1.0/People/:id', (req, res, next)=>{
  let payload = testingData[+req.params.id % 5];
  payload.id = 101 + (+req.params.id % 5);
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

// CRUD: creation
app.post('/api/1.0/People', (req, res, next)=>{
  let data = req.body;
  console.log(`got POST: body=`, JSON.stringify(data));
  res.append('Content-Type', 'application/json');
  data.version = 1;
  data.creationDate = new Date();
  res.end(JSON.stringify(data));
});

// slow response
// query.delay : int(default=10), second to end response.
// query.outNum10 : boolean(default=false), response body will be a number: `10`.
// query.outRand100 : boolean(default=false), response body will be a random int/number in range 1-100.
app.get('/api/1.0/slow', (req, res, next)=>{
  let delay;
  if (+req.query.delay) {
    delay = (+req.query.delay) * 1000;
  } else {
    delay = 10000; // default 10s
  }
  if (debug) console.log('slow with delay=', delay);
  let payload;
  if (req.query.outNum10 == ''+true) {
    payload = 10;
  } else if (req.query.outRand100 == ''+true) {
    payload = 1+Math.floor(Math.random() * 100);
  } else {
    payload = moment().format();
  }
  res.append('Content-Type', 'plain/text');
  res.write(JSON.stringify(payload));
  setTimeout(()=>{
    res.end();
  }, delay);
});

// long, slow response
// query.delay : int, second to end response.
app.get('/api/1.0/long', (req, res, next)=>{
  let delay;
  if (+req.query.delay) {
    delay = (+req.query.delay) * 1000;
  } else {
    delay = 10000; // default 10s
  }
  if (debug) console.log('long+slow with delay=', delay);

  res.append('Content-Type', 'plain/text');
  let i=0;
  let reqRandId = Math.floor(Math.random() * 900)+100;
  let repeatingTask = setInterval(()=>{
    if (debug) console.log('long+slow keep-writing, '+(i++));
    res.write(`s${serverRandId} r${reqRandId}: `+moment().format()+'\n');
  }, 1000);
  setTimeout(()=>{
    clearInterval(repeatingTask);
    res.end();
  }, delay);
});

app.listen(port, ()=>{
  console.log(`server[${serverRandId}] started at port=[%d].`, port);
});
