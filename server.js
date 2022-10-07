const express = require('express')
const favicon = require('serve-favicon')
const nunjucks = require('nunjucks')
const path = require('path')

const { env } = require('process')

const app = express()
const port = process.env.PORT || 3000

// middlewares
app.use(express.json())

// se configura uso de formularios
// app.use(express.urlencoded({extended: true}))
app.use(express.urlencoded({extended: false}))
// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// se configura nunjucks
const nunj_env = nunjucks.configure(path.resolve(__dirname, "views"), {
  express: app,
  autoscape: true,
  noCache: true,
  watch: true,
});
nunj_env.addGlobal('app_name', process.env.app_name)

// con ejs sería
/*
const ejs = require('ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
*/

// rutas
// app.use(require('./routes/auth'))
app.use(require('./routes/routes'))

app.listen(port, () => {
  console.log(`Servidor en puerto http://localhost:${port}`)
})

// psql -U postgres
//Un1
// \l
// \c basedato
// \dt
// q
// select * from users;
// select * from messages;
// select * from comments;
// drop table messages cascade;

// nodemon server

// ver detalles de conexion
// heroku logs --tail

// npm start
