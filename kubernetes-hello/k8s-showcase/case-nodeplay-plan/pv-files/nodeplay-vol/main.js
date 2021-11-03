let express = require('express');
let moment = require('moment');

let app = express();
let port = 8080;
let debug = (+process.env.debug || process.env.debug === 'true');
let serverRandId = Math.floor(Math.random() * 9000)+1000;

app.use(express.json()); // for parsing post body in json
app.use(express.urlencoded({ extended:true })); // to enable form-urlencoded

app.get('/api/1.0/about', (req, res, next)=>{
  let payload = {
    server: serverRandId,
    time: moment().format(),
    debug: debug,
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

app.listen(port, ()=>{
  console.log(`server[${serverRandId}] started at port=[%d].`, port);
});
