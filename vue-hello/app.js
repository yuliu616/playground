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

app.listen(port, ()=>{
  console.log('server started at port=[%d].', port);
});
