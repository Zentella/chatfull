const { pool } = require('./pool.js') // produccion
// const pool = require('./pool_dev')
console.log('messages.js')

async function create_table() {
  const client = await pool.connect()

  await client.query(`
    create table if not exists messages (
      id serial primary key,
      user_id int not null references users(id),
      message varchar(255) not null,
      likes int not null,
      date timestamp without time zone DEFAULT now()
    )
  `)
  // 3. Devuelvo el cliente al pool date timestamp without time zone DEFAULT now()
  client.release()
}
create_table()

async function get_messages() {

  const client = await pool.connect()
  const { rows } = await client.query(
    `select id(messages), user_id, message, likes, date, name, face, face2, hair, hair2, eyes from messages join users on users.id = messages.user_id order by date desc`
  )
  client.release()

  return rows // [0]
}

async function create_message(user_id, message, likes) {
  console.log('create_message')

  const client = await pool.connect()

  await client.query(
    `insert into messages (user_id, message, likes) values ($1, $2, $3)`,
    [user_id, message, likes]
  )

  client.release()  
  
  // return resp.rows[0]
}

async function get_message(id) {

  const client = await pool.connect()

  const { rows } = await client.query(
    `select * from messages where id=$1`,
    [id]
  )
  client.release()

  return rows[0]
}

async function update_message(likes, id) {

  const client = await pool.connect()

  await client.query(
    `update messages set likes = $1 where id = $2`,
    [likes, id]
  )
  client.release()

  // return rows[0]
}

module.exports = { create_message, get_messages, get_message, update_message}
