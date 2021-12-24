import * as mysql from 'mysql2';
import * as moment from 'moment';
import * as Promise from 'bluebird';
import * as mybatisMapper from 'mybatis-mapper';
import { Format } from 'mybatis-mapper';
import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import { PromiseUtil } from './PromiseUtil';
import { ArrayUtil } from './ArrayUtil';

import {
  Counter_Straight,
  Counter_Uuid,
  Counter_TimeBasedRand,
} from './Counter';

const CONN_POOL = (+process.env.CONN_POOL || 2);
const BATCH_CONCURRENT_COUNT = (+process.env.CC || 50);
const BATCH_REPEAT_COUNT = (+process.env.REPEAT || 6);
const ADD_WAIT = +process.env.ADD_WAIT; // ms
const ECHO_EACH_ST = +process.env.ECHO_EACH_ST;
const PREP_TIME_WAIT_PERIOD_SEC = +process.env.PREP_TIME_WAIT_PERIOD_SEC;

const connectionPool = mysql.createPool({
  host: '127.0.0.1',
  user: 'dbuser',
  password: 'pass1234',
  database: 'hellodb',
  connectionLimit: CONN_POOL,
});

let overallStartTime;
let overallSummary  = {
  stExecuted: 0,
  stError: 0,
  startTime: null,
  endTime: null,
  duration: null,
  rowsReturned: 0,
  rowsAffected: 0,
  totalLapsedTime: 0, // sum of all lapsed time of statement
  averageExecutionTime: null,
};

mybatisMapper.createMapper([
  './src/mapper/People-Mapper.xml',
]);

const format: Format = {
  language: 'sql',
  indent: '',
};

let idBaseNumber = 101_000_000 + (+process.env.ID_OFFSET || 0);
let counter = new Counter_Straight(idBaseNumber);

function processSt(){
  let startTime = new Date().getTime();
  overallSummary.stExecuted++;

  // let st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper',
  //    'generatePeopleId', {}, format);
  let x = counter.getAndInc();
  // let x = 'P00-'+counter.getAndInc();
  // let x = `C${Math.floor(Math.random()*1024+10000).toString().substring(1)}-`+counter.getAndInc();
  // let st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper',
  //   'insertPeopleWithModel', {
  //     it: <any>{
  //       id: x,
  //       nickname: "John.a."+(101_000_000+counter.counter),
  //       gender: "MALE",
  //       dateOfBirth: "1996-02-15", // db column type = date (for LocalDate)
  //       firstName: "Peter",
  //       lastName: "Chan",
  //       heightInCm: 199.80,
  //       weightInKg: 85.2300,
  //       isActive: true, // db column type = bit (for Boolean)
  //     },
  //   }, format);
  let st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'findPeopleById', { id: x }, format);
  // let st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
  //   'listAllPeople', { pageOffset: 0, pageSize: 100 }, format);
  // let st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
  //   'updatePeopleWithModel', { 
  //     it: <any>{
  //       id: x,
  //       version: 1,
  //       nickname: "Mary",
  //       gender: "FEMALE",
  //       dateOfBirth: "1974-06-24", // db column type = date (for LocalDate)
  //       firstName: "Mary",
  //       lastName: "Zhang",
  //       heightInCm: 163.1,
  //       weightInKg: 49.33,
  //       isActive: true, // db column type = bit (for Boolean)
  //     }
  //   }, format);

  return connectionPool.promise().getConnection().then(conn=>{
    return conn.query(st).then(([results])=>{
      let lapsedTime = new Date().getTime() - startTime;
      if ("length" in results && results.length) {
        overallSummary.rowsReturned += results.length;
      }
      if ("affectedRows" in results && results.affectedRows) {
        overallSummary.rowsAffected += results.affectedRows;
      }
      let result = {
        lapsed: lapsedTime,
        "0.id": (results[0] ? results[0].id : null),
        rows: (results as RowDataPacket).length,
        affectedRows: (results as ResultSetHeader).affectedRows,
        insertId: (results as ResultSetHeader).insertId,
      };
      if (result.rows !== null && result.rows === 0) {
        throw Error('query return zero row.');
      } else if (result.affectedRows !== null && result.affectedRows === 0) {
        throw Error('update/insert affected zero row.');
      } 
      return {conn, result};
    }).then(({conn, result})=>{
      overallSummary.totalLapsedTime += result.lapsed;
      conn.release();
      if (ADD_WAIT) {
        return PromiseUtil.wait(ADD_WAIT, result);
      } else {
        return result;
      }
    }).catch(err=>{
      let lapsedTime = new Date().getTime() - startTime;
      overallSummary.stError++;
      overallSummary.totalLapsedTime += lapsedTime;
      throw err;
    });
  });
}


let batchFactory = ()=>{
  let taskOfBatch = [];
  for (let i=0; i<BATCH_CONCURRENT_COUNT; i++) {
    taskOfBatch.push(processSt().then(res=>{
      if (ECHO_EACH_ST) {
        console.log(new Date().toISOString(), ` results =`, res);
      } else {
        process.stdout.write('.');
      }
    }));
  }

  let batch = Promise.all(taskOfBatch);
  return batch;
};

let repeating = ArrayUtil.createArray(0, BATCH_REPEAT_COUNT);

let prepWaitTask;
if (PREP_TIME_WAIT_PERIOD_SEC) {
  prepWaitTask = PromiseUtil.waitForRightMoment(PREP_TIME_WAIT_PERIOD_SEC, new Date());
} else {
  prepWaitTask = Promise.resolve(0); // no_ops
}
prepWaitTask.then(()=>{
  overallStartTime = new Date();
  overallSummary.startTime = overallStartTime.toISOString();
  let job = Promise.mapSeries(repeating, batchFactory);
  // let job = batchFactory();
  return job;
}).then(()=>{
  let overallEndTime = new Date();
  overallSummary.endTime = overallEndTime.toISOString();
  overallSummary.duration = overallEndTime.getTime() - overallStartTime.getTime();
  overallSummary.averageExecutionTime = overallSummary.totalLapsedTime / overallSummary.stExecuted;
  console.log();
  console.log('=============================================');
  console.log(`overallSummary=`, overallSummary);
  console.log('DONE.');
}).catch(err=>{
  console.error(`ERROR: `, err);
  throw err;
}).finally(()=>{
  process.exit(0);
});
