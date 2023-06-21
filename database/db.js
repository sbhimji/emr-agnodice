const { Pool } = require('pg')

//cloud config
// const pool = new Pool({
//   user: 'postgres',
//   host: '35.223.157.176',
//   database: 'postgres',
//   password: 'postgres1234',
//   port: 5432,
// })

//local config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'demoDB',
  password: 'saim1234',
  port: 5432,
})


module.exports = pool;
