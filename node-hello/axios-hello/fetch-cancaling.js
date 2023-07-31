import axios from 'axios';

async function main() {
  try {
    console.log(`making request [time=${new Date().toISOString()}] ...`);

    // AbortController is a javascript built-in class
    // > https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    let abortController = new AbortController();
    setTimeout(()=>{
      if (Math.random() > 0.5) {
        console.log('you are lucky, lets cancel it.');
        abortController.abort();
      } else {
        console.log('sorry, i wont cancel it this time.');
      }
    }, 3000);

    let res = await axios.get(
      'http://127.0.0.1:8080/api/1.0/slow?delay=5', 
      { 
        signal: abortController.signal,
      }
    );
    let formatted = JSON.stringify(res.data, null, 2);
    console.log('response: ', formatted);

  } catch(err) {
    console.error('err.isAxiosError: ', err.isAxiosError);
    console.error('err.code: ', err.code); // if canceled, code=ERR_CANCELED
    console.error('err.config: ', err.config);
    console.error('err.message: ', err.message);
    console.error('err.name: ', err.name);
    console.error('error response.config: ', err.response.config);
    console.error('error response.status: ', err.response.status);
    console.error('error response.headers: ', err.response.headers);
    console.error('error response.payload: ', err.response.data);
  }
}

main();
