let express = require('express');
let moment = require('moment');

let app = express();
let port = 8080;
let debug = (+process.env.debug || process.env.debug === 'true');
let serverRandId = Math.floor(Math.random() * 9000)+1000;

app.use(express.json()); // for parsing post body in json
app.use(express.urlencoded({ extended:true })); // to enable form-urlencoded

app.use(express.static('public'));

app.get('/api/1.0/about', (req, res, next)=>{
  let payload = {
    server: serverRandId,
    time: moment().format(),
    timeUnix: moment().unix(),
    timeMs: moment().millisecond(),
    debug: debug,
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

app.post('/api/1.0/debug', (req, res, next)=>{
  debug = !debug;
  let msg = `debug toggled, current value=[${debug}].`;
  console.log(msg);
  let payload = {
    text: msg,
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
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

// memory eater(wasting)
// query.delay : int(default=10), second to end response.
// query.scale : int(default=512), around 5M, write 512 x 1024 bytes per seconds.
app.get('/api/1.0/eater', (req, res, next)=>{
  let delay;
  if (+req.query.delay) {
    delay = (+req.query.delay);
  } else {
    delay = 10; // default 10s
  }
  if (debug) console.log(`eater with delay= ${delay}s`);

  let scale;
  if (+req.query.scale) {
    scale = (+req.query.scale) * 1024;
  } else {
    scale = 512 * 1024; // default 512 x 1024
  }
  if (debug) console.log(`eater with scale= ${scale}`);

  let buffer = [];

  let repeatingTask = setInterval(()=>{
    if (debug) console.log(`eater repeatingTask.doTask() - iteration start`);

    let b = [];
    for (let i=0;i<scale;i++) {
      b.push("0");
    }
    buffer.push(b);
    if (debug) console.log(`eater repeatingTask.doTask() - iteration ended with buffer list count=${buffer.length}.`);

    delay -= 1;
    if (delay <= 0) {
      clearInterval(repeatingTask);
      res.append('Content-Type', 'plain/text');
      let bufferElementSize = buffer.length > 0 ? buffer[0].length : 0;
      res.write(`eater ended with buffer size=${bufferElementSize}x${buffer.length}.`);
      res.end();
    }
  }, 1000);
});

// cpu eater(wasting)
// query.times   : int(default=1), times to repeat(interval)
// query.interval: int(default=100), repeating frequency.
// query.scale   : int(default=64), process 64 x 1024 x 1024 math calculation per 0.1s (if interval is 100).
app.get('/api/1.0/calc', (req, res, next)=>{
  let times;
  if (+req.query.times) {
    times = (+req.query.times);
  } else {
    times = 1; // default 1
  }
  if (debug) console.log(`calc with delay= ${delay}ms`);

  let freq;
  if (+req.query.interval) {
    freq = (+req.query.interval);
  } else {
    freq = 100; // default 100ms
  }
  if (debug) console.log(`calc with freq= ${freq}`);

  let scale;
  if (+req.query.scale) {
    scale = (+req.query.scale) * 1024 * 1024;
  } else {
    scale = 64 * 1024 * 1024; // default 64 x 1024 x 1024
  }
  if (debug) console.log(`calc with scale= ${scale}`);

  let timesLeft = times;
  let repeatCounter = 0;
  let repeatingTask = setInterval(()=>{
    if (debug) console.log(`calc repeatingTask.doTask() - iteration start`);

    let ans;
    for (let i=0;i<scale;i++) {
      ans = Math.pow(Math.pow(Math.PI, 8.96421) / 2.45776, 32.0);
    }
    if (debug) console.log(`calc repeatingTask.doTask() - iteration ended.`);
    repeatCounter += 1;
    timesLeft -= 1;
    if (timesLeft <= 0) {
      clearInterval(repeatingTask);
      res.append('Content-Type', 'plain/text');
      res.write(`calc ended repeated ${repeatCounter} times.`);
      res.end();
    }
  }, freq);

});

app.get('/api/1.0/big', (req, res, next)=>{
  let scale;
  if (+req.query.scale) {
    scale = (+req.query.scale) * 1024;
  } else {
    scale = 64 * 1024; // default 64 x 1024
  }
  if (debug) console.log(`big with scale= ${scale}`);

  for (let i=0;i<scale;i++) {
    res.write('.');
  }
  res.end();
});

app.listen(port, ()=>{
  console.log(`server[${serverRandId}] started at port=[%d].`, port);
});
