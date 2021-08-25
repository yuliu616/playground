let redis = require('redis');
let redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

redisClient.on("ready", ()=>{
  console.error("redis is ready");
});
redisClient.on("error", (err)=>{
  console.error("redis error: ", err);
});

redisClient.set('price', '10.5', ()=>{
  console.log('set price: done.');
});
redisClient.set('age', '44', ()=>{
  console.log('set age: done.');
});
redisClient.get('age', (err, data)=>{
  if (err) {
    console.error('error when get age:', err);
    return;
  }
  console.log('get age = ', data);
});

setTimeout(()=>{
  console.log('auto close redis.');
  redisClient.quit();
}, 5000);