'use strict';

let path = require('path');
let express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

let app = express();
let port = 8888;

let serviceProvider = {
  rest_service: {
    // for proxy:
    //    http://127.0.0.1:8888/api/1.0/         => http://127.0.0.1:8080/api/1.0/
    //    http://127.0.0.1:8888/api/version      => http://127.0.0.1:8080/api/1.0/version
    url: 'http://127.0.0.1:8080/',
    apiBaseUrl: '/api/1.0/',
    aboutUrl: '/api/1.0/version',
  },
};

// health checking endpoint for the express-app itself.
app.get('/works', (req, res, next)=>{
  res.end('express-app works!');
  next();
});

// proxy for services
app.use('/api/1.0/', createProxyMiddleware({
  target: serviceProvider.rest_service.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/1.0/': serviceProvider.rest_service.apiBaseUrl,
  }
}));
app.use('/api/version', createProxyMiddleware({
  target: serviceProvider.rest_service.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/version': serviceProvider.rest_service.aboutUrl,
  }
}));
app.use('/ws', createProxyMiddleware({
  target: 'ws://127.0.0.1:8080/',
  ws: true,
}));

///////////////////////////////
// proxy to gui-web [debug mode server]
// >> http://127.0.0.1:8888/ => http://127.0.0.1:4300/
app.use('/', createProxyMiddleware({
  target: 'http://127.0.0.1:4300/', 
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res)=>{
    delete proxyRes.headers['etag'];
    proxyRes.headers['etag'] = 'A'+Math.random()+'-'+Math.random()+'-'+Math.random();
    proxyRes.headers['Cache-Control'] = 'no-cache';
  },
}));


///////////////////////////////
// // proxy to gui-web [static files]
// // >> http://127.0.0.1:8080/index.html => ./dist/index.html
// app.use(express.static('client/dist'));

// // any path that like a client side route (/a/b/c?qs=123),
// // always point to the fallback file (index.html)
// app.get(/^(\/[A-Za-z0-9_\-]+)+(\?.*)*$/, (req, res)=> {
//   res.sendFile(path.resolve(__dirname, 'client/dist/index.html'));
// });


///////////////////////////////

app.listen(port, ()=>{
  console.log('express-app served at port=[%d].', port);
});
