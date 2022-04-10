const {DB_HOST,DB_PORT,DB_USER,DB_PW,DB_NAME} = process.env;

const poolConfig = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PW,
  database: DB_NAME,
}

console.log(poolConfig);

const {Pool} = require('pg');

const pool = new Pool({poolConfig});

pool.connect();

module.exports = pool;