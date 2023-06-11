const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: '35.223.157.176',
  database: 'postgres',
  password: 'postgres1234',
  port: 5432,
})


module.exports = pool;

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })