'use strict';

let express = require('express');
let bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

let app = express();
let port = 8080;

// health checking endpoint for the entry-app itself.
app.get('/works', (req, res, next)=>{
  res.end('express-app works!');
  next();
});

// proxy to angular static output (assume already built)
// >> http://127.0.0.1:8080/index.html => ./angular-app/dist/angular-app/index.html
app.use(express.static('../angular-app/dist/angular-app'));

// proxy to angular debug mode server
// >> http://127.0.0.1:8080/ => http://127.0.0.1:4200/
app.use('/', createProxyMiddleware({
  target: 'http://127.0.0.1:4200/', 
  changeOrigin: true
}));

app.listen(port, ()=>{
  console.log('express-app served at port=[%d].', port);
});
