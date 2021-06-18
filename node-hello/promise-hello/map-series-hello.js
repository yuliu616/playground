let Promise = require('bluebird');

let listWith20 = arrayMaker(20, 'x');

let taskFactory = ()=>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      console.log('done at', new Date().toISOString());
      resolve();
    }, 1000);
  });
};

console.log('start');
Promise.mapSeries(listWith20, taskFactory).then(()=>{
  console.log('end');
});

// helper function
/**
 * create an array with the target size 
 * and all element as specified.
 */
 function arrayMaker(size, element){
  let out = [];
  for (i=0;i<size;i++) {
    out.push(element);
  }
  return out;
}
