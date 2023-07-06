let axios = require('axios');
let YAML = require('yamljs');

let targetUrl = 'https://weibo.com/ajax/side/hotSearch';

let indentSpace = 2;
let inlineForDepthOver = 10;

axios.get(targetUrl).then(res=>{
  let formatted = YAML.stringify(res.data, inlineForDepthOver, indentSpace);
  console.log(`# HTTP GET: ${targetUrl}`);
  console.log(`# STATUS ${res.status}`);
  console.log();
  console.log(formatted);
}).catch(err=>{
  console.error('err.config: ', err.config);
  console.error('err.message: ', err.message);
  console.error('err.name: ', err.name);
  console.error('error response.config: ', err.response.config);
  console.error('error response.status: ', err.response.status);
  console.error('error response.headers: ', err.response.headers);
  console.error('error response.payload: ', err.response.data);
});
