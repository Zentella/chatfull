const { pool } = require('./pool.js') // produccion
// const pool = require('./pool_dev')
console.log('comments.js')

async function create_table() {
  const client = await pool.connect()

  await client.query(`
    create table if not exists comments (
      primary key (user_id, message_id),
      user_id int not null references users(id),
      message_id int not null references messages(id),
      comment varchar(255) not null,
      date timestamp without time zone DEFAULT now()
    )
  `)
  // 3. Devuelvo el cliente al pool date timestamp without time zone DEFAULT now()
  client.release()
}
create_table()

async function get_comments() {

  const client = await pool.connect()
  const { rows } = await client.query(
    `select user_id, message_id, comment, date, name, face, face2, hair, hair2, eyes  from comments join users on users.id = comments.user_id order by date desc` //, name    ... , users`
  )
  client.release()

  return rows // [0]
}

async function create_comment(user_id, message_id, comment) {
  console.log('create_comment ', user_id, message_id, comment)

  const client = await pool.connect()

  await client.query(
    `insert into comments (user_id, message_id, comment) values ($1, $2, $3)`,
    [user_id, message_id, comment]
  )

  client.release()  
  
  // return resp.rows[0]
}

async function get_comment(id) {

  const client = await pool.connect()

  const { rows } = await client.query(
    `select * from comments where id=$1`,
    [id]
  )
  client.release()

  return rows[0]
}

async function update_comment(likes, id) {

  const client = await pool.connect()

  await client.query(
    `update comments set likes = $1 where id = $2`,
    [likes, id]
  )
  client.release()

  // return rows[0]
}

module.exports = { create_comment, get_comments} //, get_comment, update_comment}
