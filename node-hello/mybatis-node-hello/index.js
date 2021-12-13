const mysql = require('mysql2');
const moment = require('moment');
const Promise = require('bluebird');
const mybatisMapper = require('mybatis-mapper');

const CONN_POOL = (+process.env.CONN_POOL || 1);

const connectionPool = mysql.createPool({
  host: '127.0.0.1',
  user: 'dbuser',
  password: 'pass1234',
  database: 'hellodb',
  connectionLimit: CONN_POOL,
});

mybatisMapper.createMapper([
  'mapper/People-Mapper.xml',
]);

const format = {
  language: 'sql',
  indent: '',
};

let st;
if (process.argv[2] == 'query') {
  let param = { id: 33002 };
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'findPeopleById', param, format);

} else if (process.argv[2] == 'list') {
  let param = {
    pageOffset: 0, 
    pageSize: 10,
    isActive: true,
    idMin: '33004',
    idMax: '33007',
    creationDateMin: moment('2020-12-24T15:59:00Z').utc().format(),
    creationDateMax: moment('2020-12-26T22:29:00Z').utc().format(),
    lastUpdatedMin: moment('2020-12-24T15:59:00Z').utc().format(),
    lastUpdatedMax: moment('2020-12-26T22:29:00Z').utc().format(),
  };
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'listAllPeople', param, format);

} else if (process.argv[2] == 'search') {
  let param = {
    pageOffset: 0, 
    pageSize: 10,
    // isActive: true,
    idMin: '333',
    idMax: '334',
    // creationDateMin: moment('2020-12-24T15:59:00Z').utc().format(),
    // creationDateMax: moment('2020-12-26T22:29:00Z').utc().format(),
    // lastUpdatedMin: moment('2020-12-24T15:59:00Z').utc().format(),
    // lastUpdatedMax: moment('2020-12-26T22:29:00Z').utc().format(),
    namePattern: '(^I|ll$)'
  };
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'findPeopleWithNameSimilarTo', param, format);  

} else if (process.argv[2] == 'query-id-list') {
  let param = {
    idList: [
      '33004',
      '33005',
      '33008',
      '33009',
    ],
  };
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'findPeopleByIdList', param, format);

} else if (process.argv[2] == 'update') {
  let param = {
    it: {
      id: '33003',
      version: 1,
      nickname: "Mary",
      gender: "FEMALE",
      dateOfBirth: "1974-06-24", // db column type = date (for LocalDate)
      firstName: "Mary",
      lastName: "Zhang",
      heightInCm: 163.1,
      weightInKg: 49.33,
      isActive: true, // db column type = bit (for Boolean)
    }
  };
  console.log('model to be updated:', param);
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'updatePeopleWithModel', param, format);
  // affected row will be returned at results.affectedRows

} else if (process.argv[2] == 'insert') {
  let id = 34000 + Math.floor(1000*Math.random());
  let param = {
    it: {
      id: id,
      nickname: "Rick",
      gender: "MALE",
      dateOfBirth: "1996-02-15", // db column type = date (for LocalDate)
      firstName: "Peter",
      lastName: "Chan",
      heightInCm: 199.80,
      weightInKg: 85.2300,
      isActive: false, // db column type = bit (for Boolean)
    }
  };
  console.log('model to be inserted:', param);
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'insertPeopleWithModel', param, format);
  // affected row will be returned at results.affectedRows

} else if (process.argv[2] == 'id') {
  let param = null;
  console.log('model to be inserted(for auto-number):', param);
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'generatePeopleId', param, format);
  // auto number will be returned at results.insertId

} else if (process.argv[2] == 'count') {
  let param = {
    isActive: true,
    idMin: '33004',
    idMax: '33007',
    creationDateMin: moment('2020-12-24T15:59:00Z').utc().format(),
    creationDateMax: moment('2020-12-26T22:29:00Z').utc().format(),
    lastUpdatedMin: moment('2020-12-24T15:59:00Z').utc().format(),
    lastUpdatedMax: moment('2020-12-26T22:29:00Z').utc().format(),
  };
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'countAllPeople', param, format);

} else { // default statement
  console.log(`you could specify which kind of statement to run by command line argument.`);
  console.log(`  support: query, update, insert, list, search, count, id(auto number), query-id-list`);

  let param = { id: 33001 };
  st = mybatisMapper.getStatement('com.yu.modelMapper.PeopleMapper', 
    'findPeopleById', param, format);
}

connectionPool.promise().getConnection().then(conn=>{

  console.log('sql =');
  console.log(st);
  console.log('');
  
  conn.query(st).then(([results, fields])=>{
    if (fields) {
      console.log(`query executed, typeof:fields=`, typeof(fields));
      console.log(`query executed, fields.keys=`, Object.keys(fields));
    }
    console.log(`query executed, typeof:results=`, typeof(results));
    console.log(`query executed, results.keys=`, Object.keys(results));

    // for fields
    if (fields) {
      console.log(`fields =`);
      for (let f in fields){
        // console.log(` field[${f}] = `, fields[f]);
        console.log(`  field[${f}] = ${fields[f].name} columnLength=${fields[f].columnLength} columnType=${fields[f].columnType} decimals=${fields[f].decimals}`);
      }
    }

    console.log(`results =`);
    for (let recordKey in results){
      console.log(` results[${recordKey}] = `, results[recordKey]);
    }

    conn.release();

  }).then(()=>{
    console.log('=============================================');
    console.log('DONE.');

  }).catch(err=>{
    console.error(`ERROR: error executing statement: `, err);
    throw err;
  }).finally(()=>{
    conn.release();
    process.exit(0);
  });

}).catch(err=>{
  console.error(`ERROR: error getting connection: `, err);
  throw err;
});
