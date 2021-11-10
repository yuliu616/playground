let express = require('express');
let moment = require('moment');

let app = express();
let port = 8080;
let debug = (+process.env.debug || process.env.debug === 'true');
let serverRandId = Math.floor(Math.random() * 9000)+1000;

app.use(express.json()); // for parsing post body in json
app.use(express.urlencoded({ extended:true })); // to enable form-urlencoded

app.get('/api/1.0/about', (req, res, next)=>{
  console.log('GET about invoked');
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

function serveVerbose(req, res, next){
  console.log(new Date().toISOString(), `request.method: ${req.method}`);
  console.log(new Date().toISOString(), `request.url: ${req.url}`);
  console.log(new Date().toISOString(), ` >> path: ${req.path}`);
  if (Object.keys(req.query).length) {
    console.log(`request.query:`);
    console.log(req.query);
  }
  console.log(`request.headers:`);
  for (let header in req.headers) {
    console.log(` >> header[${header}]: ${req.headers[header]}`);
  }
  console.log(`request.body(json/form):`, req.body);
  
  let payload = {
    value: moment().format()
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
  console.log();
}

app.get(/\/.*/, serveVerbose);
app.post(/\/.*/, serveVerbose);
app.put(/\/.*/, serveVerbose);
app.delete(/\/.*/, serveVerbose);
app.options(/\/.*/, serveVerbose);
// app.get('/', serveVerbose);
// app.get('/api/', serveVerbose);
// app.get('/api/1.0', serveVerbose);
// app.get('/api/1.0/a', serveVerbose);
// app.get('/api/1.0/a/', serveVerbose);
// app.get('/api/1.0/a/verbose', serveVerbose);
// app.get('/api/1.0/a/b', serveVerbose);
// app.get('/api/1.0/a/b/', serveVerbose);
// app.get('/api/1.0/a/b/verbose', serveVerbose);
// app.get('/api/1.0/a/b/c', serveVerbose);
// app.get('/api/1.0/a/b/c/', serveVerbose);
// app.get('/api/1.0/a/b/c/verbose', serveVerbose);
// app.get('/api/1.0/b', serveVerbose);
// app.get('/api/1.0/b/verbose', serveVerbose);
// app.get('/api/1.0/verbose', serveVerbose);
// app.post('/api/1.0/verbose', serveVerbose);
// app.put('/api/1.0/verbose', serveVerbose);
// app.delete('/api/1.0/verbose', serveVerbose);
// app.options('/api/1.0/verbose', serveVerbose);


app.listen(port, ()=>{
  console.log('server started at port=[%d].', port);
});
