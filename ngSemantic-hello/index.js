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

app.get('/api/version', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify({
    apiVersion: 'v1.0',
    serverTime: new Date().toISOString(),
  }));
  next();
});

app.get('/api/1.0/People', (req, res, next)=>{
  let searchText = req.query.searchText;
  setTimeout(()=>{
    // waited
    res.header('Content-Type', 'application/json');
    if (searchText) {
      res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST.filter(p=>p.first_name.indexOf(searchText)>=0)));
    } else {
      res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST));
    }
    next();
  }, 2000);  
});

app.get('/api/1.0/People/1', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST[0]));
  next();
});

app.get('/api/1.0/People/2', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST[1]));
  next();
});

app.get('/api/1.0/People/3', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST[2]));
  next();
});

app.get('/api/1.0/People/4', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST[3]));
  next();
});

app.post('/api/1.0/People', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_PEOPLE_LIST[1]));
  next();
});

app.get('/api/1.0/Invoice', (req, res, next)=>{
  setTimeout(()=>{
    // waited
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify(SAMPLE_DATA_INVOICE_DTO_LIST));
    next();
  }, 3500);  
});

app.get('/api/1.0/Invoice/37', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_INVOICE_DTO_LIST[0]));
  next();
});

app.get('/api/1.0/Invoice/38', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_INVOICE_DTO_LIST[1]));
  next();
});

app.get('/api/1.0/Invoice/39', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_INVOICE_DTO_LIST[2]));
  next();
});

app.get('/api/1.0/Invoice/40', (req, res, next)=>{
  res.header('Content-Type', 'application/json');
  res.end(JSON.stringify(SAMPLE_DATA_INVOICE_DTO_LIST[3]));
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
      "nickname": "Iron King",
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
      "nickname": "Poker face",
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
      "nickname": "Bloody",
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
      "nickname": "The Dude",
      "gender": "FEMALE",
      "date_of_birth": "1947-10-15T00:00:00.000Z",
      "weight_in_kg": 19.24,
      "born_family_id": null
  }
];

const SAMPLE_DATA_INVOICE_DTO_LIST = {
  productList: [
    {
      id: 1,
      name: "Sony Smart TV 43 inch",
    },
    {
      id: 2,
      name: "Huawei Nova 5z",
    },
    {
      id: 3,
      name: "Huawei Nova 6",
    },
    {
      id: 4,
      name: "Oppo Reno 3",
    },
    {
      id: 5,
      name: "Apple iPhone 11 Pro",
    },
    {
      id: 6,
      name: "portable charge - 5000mah",
    },
    {
      id: 7,
      name: "3A battery (4 pack)",
    },
    {
      id: 8,
      name: "2A battery (4 pack)",
    },
  ],
  invoiceList: [
    {
      id: 37,
      version: 1,
      creation_date: "2018-08-14T08:41:03.000Z",
      last_update: "2018-08-14T08:41:03.000Z",
      invoice_num: "000154015046",
      bill_date: "2018-08-14T00:00:00.000Z",
      total_amount: 4300.0,
      is_voided: false,
      buyer_id: 1,
      shop_id: 1,
      item : [
        {
          id: 101,
          price: 4300.0,
          quantity: 1,
          product_id: 1,
          invoice_id: 37,
        },
      ]
    },
    {
      id: 38,
      version: 1,
      creation_date: "2018-08-18T09:41:03.000Z",
      last_update: "2018-08-18T09:41:03.000Z",
      bill_date: "2018-08-18T00:00:00.000Z",
      invoice_num: "000170034067",
      total_amount: 3300.0,
      is_voided: false,
      buyer_id: 1,
      shop_id: 1,
      item : [
        {
          id: 111,
          price: 2600.0,
          quantity: 1,
          product_id: 2,
          invoice_id: 38,
        },
        {
          id: 112,
          price: 350.0,
          quantity: 2,
          product_id: 6,
          invoice_id: 38,
        },
      ]
    },
    {
      id: 39,
      version: 1,
      creation_date: "2018-09-10T10:21:03.000Z",
      last_update: "2018-09-10T10:21:03.000Z",
      bill_date: "2018-09-10T00:00:00.000Z",
      invoice_num: "000170034088",
      total_amount: 8968.0,
      is_voided: false,
      buyer_id: 1,
      shop_id: 1,
      item : [
        {
          id: 181,
          price: 8600.0,
          quantity: 1,
          product_id: 5,
          invoice_id: 39,
        },
        {
          id: 182,
          price: 320.0,
          quantity: 1,
          product_id: 6,
          invoice_id: 39,
        },
        {
          id: 183,
          price: 12.0,
          quantity: 4,
          product_id: 7,
          invoice_id: 39,
        },
      ]
    },
    {
      id: 40,
      version: 1,
      creation_date: "2018-09-20T08:11:03.000Z",
      last_update: "2018-09-20T08:11:03.000Z",
      bill_date: "2018-09-20T00:00:00.000Z",
      invoice_num: "000181034682",
      total_amount: 1020.0,
      is_voided: false,
      buyer_id: 1,
      shop_id: 1,
      item : [
        {
          id: 204,
          price: 340.0,
          quantity: 3,
          product_id: 6,
          invoice_id: 40,
        },
      ]
    },
  ],
}