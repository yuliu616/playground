let Schema = require('jugglingdb').Schema;

//define data source
let schema = new Schema('mysql', {
  host: '127.0.0.1',
  database: 'john_test',
  username: 'devuser',
  password: 'blesseddev'
});

//define model
let People = schema.define('People', {
  id: Number,
  first_name: String,
  last_name: String,
  date_of_birth: Date
});

//query: list/find all by filter
schema.models.People.all({
  where: {
    id: 10
  }
}).then((data:any)=>{
  console.log('data loaded: ', data);
}).catch((err:any)=>{
  console.error('error in query: ', err);
});
