let express = require('express');
let moment = require('moment');

let app = express();
let port = 8080;

app.use(express.json()); // for parsing post body in json
app.use(express.urlencoded({ extended:true })); // to enable form-urlencoded

app.use(express.static('public'));

app.get('/api/1.0/ServerTime', (req, res, next)=>{
  let payload = {
    value: moment().format()
  };
  res.append('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
});

app.listen(port, ()=>{
  console.log('server started at port=[%d].', port);
});
