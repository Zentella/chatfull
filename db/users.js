const { pool } = require('./pool.js') // produccion
// const pool = require('./pool_dev')

const get_ping = async (req, res) => {
  const resul = await pool.query(`SELECT NOW()`)
  res.send({
    message: resul.rows[0]
  })
}

async function create_table() {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists users (
      id serial primary key,
      name varchar(255) not null,
      email varchar(255) not null unique,
      password varchar(255) not null,
      face varchar(255) not null,
      face2 varchar(255) not null,
      hair varchar(255) not null,
      hair2 varchar(255) not null,
      eyes varchar(255) not null
    )
  `)
  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()

async function get_user(email) {

  const client = await pool.connect()
  const { rows } = await client.query(
    `select * from users where email=$1`,
    [email]
  )
  client.release()

  return rows[0]
}

async function create_user(name, email, password, face, face2, hair, hair2, eyes) {

  const client = await pool.connect()

  await client.query(
    `insert into users (name, email, password, face, face2, hair, hair2, eyes) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [name, email, password, face, face2, hair, hair2, eyes]
  )

  client.release()  
  
  // return resp.rows[0]
}

module.exports = { get_ping, create_user, get_user}
