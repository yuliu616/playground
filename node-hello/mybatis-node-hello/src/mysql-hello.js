const mysql = require('mysql2');

const connectionPool = mysql.createPool({
  host: '127.0.0.1',
  user: 'ppl_dbuser',
  password: 'pass1234',
  database: 'hellodb',
  connectionLimit: 200,
});

connectionPool.promise().getConnection().then(conn=>{

  conn.query(`
    select 
      id,
      creation_date, last_updated,
      is_active, gender, nickname, date_of_birth, 
      first_name, last_name, height_in_cm, weight_in_kg
    from ppl_people
    limit 0, 2
  `).then(([rows, fields])=>{
    console.log(`query executed, typeof:fields=`, typeof(fields));
    console.log(`query executed, typeof:rows=`, typeof(rows));
    console.log(`query executed, fields.keys=`, Object.keys(fields));
    console.log(`query executed, rows.keys=`, Object.keys(rows));

    // for fields
    console.log(`fields =`);
    for (let f in fields){
      // console.log(` field[${f}] = `, fields[f]);
      console.log(`  field[${f}] = ${fields[f].name} columnLength=${fields[f].columnLength} columnType=${fields[f].columnType} decimals=${fields[f].decimals}`);
    }

    console.log(`rows =`);
    for (let rowKey in rows){
      console.log(` rows[${rowKey}] = `, rows[rowKey]);
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
