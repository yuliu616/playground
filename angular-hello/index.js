'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let proxy = require('http-proxy-middleware');

let app = express();
let port = 8080;

// health checking endpoint for the express-app itself.
app.get('/works', (req, res, next)=>{
  res.end('express-app works!');
  next();
});

app.get('/api/1.0/People', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST));
  next();
});

app.get('/api/1.0/People/1', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST[0]));
  next();
});

// proxy to angular static output (assume already built)
// >> http://127.0.0.1:8080/index.html => ./dist/html/index.html
app.use(express.static('angular-app/dist/angular-hello'));

// proxy to angular debug mode server
// >> http://127.0.0.1:8080/ => http://127.0.0.1:4200/
app.use('/', proxy({
  target: 'http://127.0.0.1:4200/', 
  changeOrigin: true
}));

app.listen(port, ()=>{
  console.log('express-app served at port=[%d].', port);
});

const SAMPLE_DATA_PEOPLE_LIST = [
  {
      "id": 1,
      "version": 1,
      "creation_date": "2018-03-24T05:46:03.000Z",
      "last_updated": "2018-03-24T05:46:03.000Z",
      "first_name": "Iolande",
      "last_name": "Alston",
      "nickname": null,
      "gender": "MALE",
      "date_of_birth": "2009-03-04T00:00:00.000Z",
      "weight_in_kg": 89.66,
      "born_family_id": null
  },
  {
      "id": 2,
      "version": 1,
      "creation_date": "2018-03-24T05:46:03.000Z",
      "last_updated": "2018-03-24T05:46:03.000Z",
      "first_name": "Chan",
      "last_name": "Decker",
      "nickname": null,
      "gender": "MALE",
      "date_of_birth": "1941-03-29T00:00:00.000Z",
      "weight_in_kg": 4.32,
      "born_family_id": null
  },
  {
      "id": 3,
      "version": 1,
      "creation_date": "2018-03-24T05:46:03.000Z",
      "last_updated": "2018-03-24T05:46:03.000Z",
      "first_name": "Rose",
      "last_name": "Coates",
      "nickname": null,
      "gender": "FEMALE",
      "date_of_birth": "1972-05-20T00:00:00.000Z",
      "weight_in_kg": 69.48,
      "born_family_id": null
  },
  {
      "id": 4,
      "version": 1,
      "creation_date": "2018-03-24T05:46:03.000Z",
      "last_updated": "2018-03-24T05:46:03.000Z",
      "first_name": "Chan",
      "last_name": "Ball",
      "nickname": null,
      "gender": "FEMALE",
      "date_of_birth": "1947-10-15T00:00:00.000Z",
      "weight_in_kg": 19.24,
      "born_family_id": null
  }
];
