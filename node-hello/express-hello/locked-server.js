let express = require('express');
let moment = require('moment');

let app = express();
let port = 8099;
let debug = (+process.env.debug || process.env.debug === 'true');
let serverRandId = Math.floor(Math.random() * 9000)+1000;

let concurrentLimit = (+process.env.CONCURRENT_LIMIT > 0 ? +process.env.CONCURRENT_LIMIT : 4);
let concurrentBusyCounter = 0;

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

function waitAndTakeBusyLock(){
  if (concurrentBusyCounter < concurrentLimit) {
    concurrentBusyCounter++;
    if (debug) console.log('concurrentBusyCounter++ =', concurrentBusyCounter);
    return Promise.resolve(0);
  }
  return new Promise((resolve, reject)=>{
    let waiter = setInterval(()=>{
      if (concurrentBusyCounter < concurrentLimit) {
        concurrentBusyCounter++;
        if (debug) console.log('concurrentBusyCounter++ =', concurrentBusyCounter);
        clearInterval(waiter);
        resolve(0);
      }
      if (debug) console.log(`[server:${serverRandId}] too busy(${concurrentBusyCounter}), wait awhile.`);
    }, 500);  
  });
}

function releaseBusyLock(){
  concurrentBusyCounter--;
  if (debug) console.log('concurrentBusyCounter-- =', concurrentBusyCounter);
}

app.get('/api/1.0/about', (req, res, next)=>{
  waitAndTakeBusyLock().then(()=>{
    let payload = {
      value: moment().format(),
      me: serverRandId,
    };
    res.append('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  
  }).catch(err=>{
    console.error(err);
    res.status(400).end();
  }).finally(()=>{
    releaseBusyLock();
  });
});

// CRUD: find by id
app.get('/api/1.0/People/:id', (req, res, next)=>{
  waitAndTakeBusyLock().then(()=>{
    let payload = testingData[+req.params.id % 5];
    payload.id = 101 + (+req.params.id % 5);
    res.append('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));      

  }).catch(err=>{
    console.error(err);
    res.status(400).end();
  }).finally(()=>{
    releaseBusyLock();
  });
});

// slow response
// query.delay : int(default=10), second to end response.
// query.outNum10 : boolean(default=false), response body will be a number: `10`.
// query.outRand100 : boolean(default=false), response body will be a random int/number in range 1-100.
app.get('/api/1.0/slow', (req, res, next)=>{
  waitAndTakeBusyLock().then(()=>{
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
      releaseBusyLock();
    }, delay);

  }).catch(err=>{
    console.error(err);
    res.status(400).end();
    releaseBusyLock();
  });
});

// long, slow response
// query.delay : int, second to end response.
app.get('/api/1.0/long', (req, res, next)=>{
  waitAndTakeBusyLock().then(()=>{
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
      releaseBusyLock();
    }, delay);
  }).catch(err=>{
    console.error(err);
    res.status(400).end();
    releaseBusyLock();
  });
});

app.listen(port, ()=>{
  console.log(`server[${serverRandId}] started at port=[%d].`, port);
  console.log(`concurrentLimit=`, concurrentLimit);
});
