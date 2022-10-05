const { Pool } = require('pg')
const secrets = require('../secrets')

const config = {
  user: secrets.db_user,
  host: secrets.db_host,
  database: secrets.db_name,
  password: secrets.db_pass,
  min: 3,
  max: 6,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000,
  port: 5432
}

const pool = new Pool(config)

module.exports = pool;

/*  secret
  module.exports = {
  db_name: 'basedato',
  db_pass: 'password',
  db_user: 'postgres',
  app_name: 'nombre_app',
  db_host: 'localhost'
} */