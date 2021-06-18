let axios = require('axios');
let Promise = require('bluebird');

let testConfig = {
  configName: 'dev',
  logProgressInDot: true,
  logProgressForEvery: 0, // 0 for disable
  logResultBody: true,
  outputCsv: true,
  testRoutineStartPeriod: 10,
};
axios.defaults.timeout = 90 * 1000; // ms

let testPlanX0 = {
  name: `nginx root`,
  repeatCount: 10,
  concurrent: 10,
  httpMethod: 'GET',
  // targetSite: 'http://127.0.0.1:8099',
  // targetSite: 'http://app:8099',
  // targetSite: 'http://n14c-gateway:80',
  // targetSite: 'http://a-gateway:80',
  targetSite: 'http://itworks:80',
  targetPath: '/',
  headers: null,
  payload: null,
  expectedStatus: 200, // HTTP status (200=OK, 400=err)
  result: {}, // to be filled by test
  checker: 'same', // options: null, 'same', 'sum', 'count', 'asserter'
  asserter: null,
};
let testPlanX1 = {
  name: `express`,
  repeatCount: 10,
  concurrent: 10,
  httpMethod: 'GET',
  // targetSite: 'http://127.0.0.1:8383',
  // targetSite: 'http://192.168.101.103:8383',
  targetSite: 'http://n14:8099',
  // targetPath: '/api/1.0/slow?delay=0.2&outNum10=true',
  // targetPath: '/api/0.1/long?delay=20',
  targetPath: '/api/1.0/long?delay=0.2',
  // targetPath: '/api/0.1/about',
  // targetPath: '/api/1.0/about',
  headers: null,
  payload: null,
  expectedStatus: 200, // HTTP status (200=OK, 400=err)
  result: {}, // to be filled by test
  checker: 'count', // options: null, 'same', 'sum', 'count', 'asserter'
  asserter: null,
};
let testPlanX2 = {
  name: `auth-about`,
  repeatCount: 10,
  concurrent: 10,
  httpMethod: 'GET',
  // targetSite: 'http://127.0.0.1:8080',
  // targetSite: 'http://auth-service:8080',
  targetSite: 'http://a-gateway:80',
  // targetPath: '/',
  targetPath: '/api/0.1/about',
  // targetPath: '/api/0.1/about?printLog=true',
  // targetPath: '/api/1.0/about?printLog=true',
  // payload: null,
  expectedStatus: 200, // HTTP status (200=OK, 400=err)
  result: {}, // to be filled by test
  // checker: 'asserter', // options: null, 'same', 'sum', 'count', 'asserter'
  // asserter: asserterGetAbout,
};
let testPlanX3 = {
  name: `auth-login`,
  repeatCount: 10,
  concurrent: 10,
  httpMethod: 'POST',
  // targetSite: 'http://127.0.0.1:8080',
  // targetSite: 'http://auth-service:8080',
  targetSite: 'http://a-gateway:80',
  // targetPath: '/api/login',
  targetPath: '/api/auth/0.1/login',
  // targetPath: '/api/1.0/login',
  headers: {
    'Content-Type': 'application/json',
  },
  // payload: null,
  payload: {
    username: 'user1001',
    password: 'pass1234',
  },
  expectedStatus: 200, // HTTP status (200=OK, 400=err)
  result: {}, // to be filled by test
  checker: 'asserter', // options: null, 'same', 'sum', 'count', 'asserter'
  asserter: asserterLoginJwt,
};
let testPlanX4 = {
  name: `People ID 33001`,
  repeatCount: 10,
  concurrent: 10,
  httpMethod: 'GET',
  // targetSite: 'http://127.0.0.1:8082',
  // targetSite: 'http://people-service:8082',
  targetSite: 'http://a-gateway:80',
  // targetPath: '/api/people/0.1/people/33001',
  targetPath: '/api/people/1.0/people/33001',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJjb20ueXUiLCJyb2xlIjpbIlJPT1RfQURNSU4iXSwiZXhwIjoxOTI1ODA3MTYxLCJ1c2VybmFtZSI6InVzZXIxMDAxIn0.zo7FhCEVhc5A8gBMDSmX06FgVtwbvsg5wEc8EJAJNMiksCsAoHEBCuzOrupk3kdcxVUsGg1Ig-nvHkQ5m7O-2g',
  },
  payload: null,
  expectedStatus: 200, // HTTP status (200=OK, 400=err)
  result: {}, // to be filled by test
  checker: 'same', // options: null, 'same', 'sum', 'count'
};
let testPlanX5 = {
  name: `People List size=30`,
  repeatCount: 10,
  concurrent: 10,
  httpMethod: 'GET',
  // targetSite: 'http://127.0.0.1:8082',
  // targetSite: 'http://people-service:8082',
  targetSite: 'http://a-gateway:80',
  // targetPath: '/api/people?size=30',
  targetPath: '/api/people/0.1/people?size=30',
  // targetPath: '/api/people/1.0/people?size=30',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJjb20ueXUiLCJyb2xlIjpbIlJPT1RfQURNSU4iXSwiZXhwIjoxOTI1ODA3MTYxLCJ1c2VybmFtZSI6InVzZXIxMDAxIn0.zo7FhCEVhc5A8gBMDSmX06FgVtwbvsg5wEc8EJAJNMiksCsAoHEBCuzOrupk3kdcxVUsGg1Ig-nvHkQ5m7O-2g',
  },
  payload: null,
  expectedStatus: 200, // HTTP status (200=OK, 400=err)
  result: {}, // to be filled by test
  checker: 'same', // options: null, 'same', 'sum', 'count'
};
let testPlanX6 = {
  name: `People creation`,
  repeatCount: 10,
  concurrent: 10,
  httpMethod: 'POST',
  // targetSite: 'http://127.0.0.1:8082',
  // targetSite: 'http://people-service:8082',
  targetSite: 'http://a-gateway:80',
  // targetPath: '/api/people',
  targetPath: '/api/people/0.1/people',
  // targetPath: '/api/people/1.0/people',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJjb20ueXUiLCJyb2xlIjpbIlJPT1RfQURNSU4iXSwiZXhwIjoxOTI1ODA3MTYxLCJ1c2VybmFtZSI6InVzZXIxMDAxIn0.zo7FhCEVhc5A8gBMDSmX06FgVtwbvsg5wEc8EJAJNMiksCsAoHEBCuzOrupk3kdcxVUsGg1Ig-nvHkQ5m7O-2g',
  },
  // payload: null,
  payload: {
    nickname: "Amazing",
    firstName: "Peter",
    lastName: "Wang",
    gender: "MALE",
  },
  expectedStatus: 200, // HTTP status (200=OK, 400=err)
  result: {}, // to be filled by test
  checker: null, // options: null, 'same', 'sum'
};
let defaultTestPlan = testPlanX0;




let getTestTaskFactory = (testConfg, testPlan)=>{

  let taskFactoryList = [];
  let doneCounter = 0;
  let dontStepCounter = 0; // 1 of 1024 of the entire job
  let planStartTime = new Date();
  let checker = {
    firstResBody: null,
    checkedCounter: 0,
    sum: 0,
    resPayloadByteCount: 0,
  };

  let httpCallFeedbackHandler = (startTimeMs, res)=>{
    if (testPlan.expectedStatus != res.status) {
      console.error(`response[${res.status}] body:`, res.data);
      throw Error(`testPlan expect[${testPlan.expectedStatus}] but got statusCode[${res.status}].`);
    }
    let endTimeMs = new Date().getTime();
    if (testPlan.checker === 'same') {
      if (checker.firstResBody == null) {
        checker.firstResBody = (typeof res.data == 'object' ? JSON.stringify(res.data) : res.data);
      } else {
        let resInJson = (typeof res.data == 'object' ? JSON.stringify(res.data) : res.data);
        if (checker.firstResBody !== resInJson) {
          throw Error('(checker=same): response body unmatch');
        } else {
          checker.checkedCounter++;
          // console.log('(checker=same): response body match, length=', resInJson.length);
        }
      }
    } else if (testPlan.checker === 'asserter') {
      testPlan.asserter(res.data);
      checker.checkedCounter++;
    } else if (testPlan.checker === 'sum') {
      checker.sum += +(res.data);
    } else if (testPlan.checker === 'count') {
      if (typeof res.data === 'string') {
        checker.resPayloadByteCount += res.data.length;
      } else if (typeof res.data === 'number') {
        checker.resPayloadByteCount += `${res.data}`.length;
      } else if (typeof res.data === 'object') {
        checker.resPayloadByteCount += JSON.stringify(res.data).length;
      } else {
        checker.resPayloadByteCount = NaN;
      }
    }
    if (!testPlan.result.logs) {
      testPlan.result.logs = [];
    }
    let log = {
      lapsedTimeMs: endTimeMs - startTimeMs,
    };
    if (testConfig.logResultBody) {
      log.resBody = res.data;
    }
    testPlan.result.logs.push(log);
    doneCounter++;
    if (testConfig.logProgressInDot) {
      let doneStep = Math.floor(doneCounter / (testPlan.concurrent * testPlan.repeatCount) * 1000);
      if (doneStep > dontStepCounter) {
        dontStepCounter = doneStep;
        process.stdout.write('.');
      }
      if (doneCounter == testPlan.concurrent * testPlan.repeatCount) {
        process.stdout.write('\n\n');
      }
    }
    if (testConfig.logProgressForEvery > 0) {
      if (testConfig.logProgressForEvery == 1 ||
      doneCounter % testConfig.logProgressForEvery == 1) {
        console.log(`[${new Date().toISOString()}] call completed: ${doneCounter} of ${testPlan.concurrent * testPlan.repeatCount}`);
      }
    }
  };
  let httpCallTaskFactory = ()=>{
    let startTimeMs = new Date().getTime();
    let apiCallTask;
    if (testPlan.httpMethod == 'GET') {
      apiCallTask = axios.get(`${testPlan.targetSite}${testPlan.targetPath}`,
        {
          headers: testPlan.headers,
        });
    } else if (testPlan.httpMethod == 'POST') {
      apiCallTask = axios.post(`${testPlan.targetSite}${testPlan.targetPath}`,
        testPlan.payload,
        {
          headers: testPlan.headers,
        });
    } else if (testPlan.httpMethod == 'PUT') {
      apiCallTask = axios.put(`${testPlan.targetSite}${testPlan.targetPath}`,
        testPlan.payload, {
          headers: testPlan.headers,
        });
    } else {
      throw Error(`unknown httpMethod [${testPlan.httpMethod}].`);
    }
    let task = apiCallTask.then(res=>{
      httpCallFeedbackHandler(startTimeMs, res);
    }).catch(err=>{
      if (err.response) {
        httpCallFeedbackHandler(startTimeMs, err.response);
      } else if (err.code == 'ETIMEDOUT') {
        throw Error(`axios connection timeout (ETIMEDOUT) occurred`);
      } else if (err.code == 'ECONNABORTED') {
        throw Error(`axios abort due to timeout (ECONNABORTED) occurred`);
      } else if (err.code == 'ECONNREFUSED') {
        throw Error(`axios abort due to connection refused (ECONNREFUSED) occurred`);
      } else if (err.toJSON && typeof err.toJSON == 'function') {
        console.error(`non-http-error occurred`, err.toJSON());
        throw err;
      } else {
        console.error(`non-http-error occurred`, err);
        throw err;
      }
    });
    return task;
  };

  let arrayOfRepeating = arrayMaker(testPlan.repeatCount, 0);
  taskFactoryList.push(()=>Promise.mapSeries(arrayOfRepeating, taskFactory));

  return (resultTextBuffer, resultCsvBuffer)=>{
    let allTasks = [];
    for (let i=0;i<testPlan.concurrent;i++) {
      let serializedTestInvocationLoop = Promise.mapSeries(
        arrayMaker(testPlan.repeatCount, 0), httpCallTaskFactory);

      allTasks.push(serializedTestInvocationLoop);
    }

    return Promise.all(allTasks).then(x=>{
      let planEndTime = new Date();

      if (testConfig.logResultBody) {
        console.log(
          `result.logs[0].resBody =`,
            JSON.stringify(testPlan.result.logs[0].resBody),
        );
        console.log();
      }
      if (testPlan.checker == 'same') {
        console.log(
          `checker:${testPlan.checker}:counter:`, checker.checkedCounter,
        );
      } else if (testPlan.checker == 'asserter') {
        console.log(
          `checker:${testPlan.checker}:counter:`, checker.checkedCounter,
        );
      } else if (testPlan.checker == 'sum') {
        console.log(
          `checker:sum:`, checker.sum,
        );
      } else if (testPlan.checker == 'count') {
        console.log(
          `checker:resPayloadByteCount:`, checker.resPayloadByteCount,
        );
      }

      // console.log(
      //   `result.logs lapesedTime =`,
      //   ...testPlan.result.logs.map(it=>it.lapsedTimeMs),
      // );
      let lapsedTimeMs = planEndTime.getTime()-planStartTime.getTime();
      console.log(
        `testPlan[${testPlan.name}] fully executed: ${planStartTime.toISOString()} ~ ${planEndTime.toISOString()} `
      );
      console.log(`(elapsed= ${planEndTime.getTime()-planStartTime.getTime()} ms)`);
      console.log();

      // summarize test result
      testPlan.result.summary = summerize(testPlan.result.logs);
      resultTextBuffer.push(
        "\""+testPlan.name+"\" = "
        +JSON.stringify(testPlan.result.summary, null, 2)
        +","
      );
      resultTextBuffer.push('');

      if (testConfig.outputCsv) {
        if (resultCsvBuffer.length == 0) {
          resultCsvBuffer.push(`config,test,repeating,concurrent,lapsed,average,med,90,95,min,max`);
        }
        resultCsvBuffer.push([
          testConfig.configName,
          `${testPlan.name} (${testPlan.repeatCount} x ${testPlan.concurrent}cc)`,
          testPlan.repeatCount,
          testPlan.concurrent,
          lapsedTimeMs,
          testPlan.result.summary.average,
          testPlan.result.summary.line50,
          testPlan.result.summary.line90,
          testPlan.result.summary.line95,
          testPlan.result.summary.min,
          testPlan.result.summary.max,
        ].join(','));
      }

    }).catch(err=>{
      resultTextBuffer.push(`testPlan[${testPlan.name}] failed:`, JSON.stringify(err));
    });
  };

}; // end getTestTaskFactory

// main routine
let resultTextBuffer = [];
let resultCsvBuffer = [];
waitForRightMoment(testConfig.testRoutineStartPeriod).then(()=>{
  // console.log(new Date().toISOString()+': time reached, lets run the test now.');
  return getTestTaskFactory(testConfig, testPlanX0)(resultTextBuffer, resultCsvBuffer);
}).then(()=>{
  return waitForRightMoment(testConfig.testRoutineStartPeriod);
}).then(()=>{
  return getTestTaskFactory(testConfig, testPlanX1)(resultTextBuffer, resultCsvBuffer);
}).then(()=>{
  console.log('');
  console.log('');
  console.log(resultTextBuffer.join('\n'));
  console.log('');
  console.log(resultCsvBuffer.join('\n'));
});

/////// functions ///////

function summerize(logs){
  let sum, count, average, line50, line90, line95, min, max;
  let sortedList = [];
  count = logs.length;
  sum = 0;
  for (let i=0;i<logs.length;i++) {
    sum += logs[i].lapsedTimeMs;
    sortedList.push(logs[i].lapsedTimeMs);
  }
  average = sum / count;
  // sort something wrongly sorted item using string sorting logic, this could avoid it.
  sortedList = sortedList.sort((a,b)=>(+a-+b));
  min = sortedList[0];
  max = sortedList[sortedList.length-1];
  line50 = sortedList[Math.floor(count * 0.5)];
  line90 = sortedList[Math.floor(count * 0.90)];
  line95 = sortedList[Math.floor(count * 0.95)];
  // console.log('sortedList(0:40) =', sortedList.slice(0, 40).join(' '));
  // console.log('sortedList(-40:-0) =', sortedList.slice(sortedList.length-40, sortedList.length).join(' '));
  // console.log('min =', min, ' max =', max);
  return {
    sum, count, average, line50, line90, line95, min, max,
  };
}

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

function wait(timeoutMs) {
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(null);
    }, timeoutMs);
  });
}

function asserterGetAbout(payload){
  if (typeof payload !== 'object') {
    console.error(`payload is not an object:`, payload);
    throw Error(`payload is not an object`);
  }
  if (!payload.currentTime ||
    !payload.currentTime.match(
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}.*Z$/)
  ) {
    console.error(`payload assertion failure:`, payload);
    throw Error(`payload assertion failure`);
  }
  if (!payload.currentDate ||
    !payload.currentDate.match(
      /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
  ) {
    console.error(`payload assertion failure:`, payload);
    throw Error(`payload assertion failure`);
  }

  let clone = Object.assign({}, payload);
  clone.currentTime = 'x';
  clone.currentDate = 'x';
  let expectedJSON = {
    currentTime: 'x',
    apiVersion: '1.0',
    currentDate: 'x',
    serviceName: 'auth-service'
  };
  if (JSON.stringify(clone) !== JSON.stringify(expectedJSON)){
    console.error(`payload assertion failure:`, payload);
    console.error(`got:`, JSON.stringify(clone));
    console.error(`expected:`, JSON.stringify(expectedJSON));
    throw Error(`payload assertion failure`);
  }
}

function asserterLoginJwt(payload){
  if (typeof payload !== 'object') {
    console.error(`payload is not an object:`, payload);
    throw Error(`payload is not an object`);
  }
  if (!payload.access_token ||
    !payload.access_token.match(
    /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/)
  ) {
    console.error(`payload assertion failure:`, payload);
    throw Error(`payload assertion failure`);
  }

  let clone = Object.assign({}, payload);
  clone.access_token = 'x';
  let expectedJSON = {
    id_token: '',
    access_token: 'x',
    refresh_token: '',
    token_type: 'Bearer'
  };
  if (JSON.stringify(clone) !== JSON.stringify(expectedJSON)){
    console.error(`payload assertion failure:`, payload);
    console.error(`got:`, JSON.stringify(clone));
    console.error(`expected:`, JSON.stringify(expectedJSON));
    throw Error(`payload assertion failure`);
  }
}

function waitForRightMoment(testRoutineStartPeriod){
  let now = new Date();
  let nowValue = now.getSeconds() * 1000 + now.getMilliseconds();
  let period = testRoutineStartPeriod * 1000;
  let passed = nowValue % period;
  let nextMoment = nowValue - passed + period;
  // console.log('now =', now.toISOString(), ', nowValue =', nowValue,
  //   ', passed =', passed, ', waitFor:', nextMoment-nowValue);
  return wait(nextMoment - nowValue);
}