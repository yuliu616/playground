import axios from 'axios';

// const JWT = 'eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJjb20ueXUiLCJyb2xlIjpbIlJPT1RfQURNSU4iXSwiZXhwIjoxOTM1MDIyOTA5LCJ1c2VybmFtZSI6InVzZXIxMDAxIn0.KnSgz53i8L2qmQIeJ0bK3ZF_sXkUa1wMPuW84fwnSqgdKATyl9uOJVAOKqDilx_6qsqPH-7o5tIUYrUAYhYoMQ';

async function main() {
  try {
    let res = await axios.get(
      'https://weibo.com/ajax/side/hotSearch',
    );
    // let res = await axios.get(
    //   'http://127.0.0.1/api/people-service/1.1/people', 
    //   { 
    //     params: { size: 100, },
    //     headers: { Authorization: `Bearer ${JWT}`},
    //   }
    // );
    let formatted = JSON.stringify(res.data, null, 2);
    console.log('response: ', formatted);
    // console.log('response.array.count: ', res.data.length);
    // console.log('response.mapped: ', res.data.map(it=>it.id));

  } catch(err) {
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
