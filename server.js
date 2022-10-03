const express = require('express')
const favicon = require('serve-favicon')

// const session = require('express-session');
const nunjucks = require('nunjucks')
const path = require('path')

const { env } = require('process')
// const flash = require('connect-flash')

// const pool = require('./db/conexion.js')

// const pgSession = require('connect-pg-simple')(session)
const fileUpload = require('express-fileupload')

const app = express()
const port = process.env.PORT || 3000 // asignar un puerto para la nube o usar 3000

// middlewares
app.use(express.json())

// se configura uso de formularios
// app.use(express.urlencoded({extended: true}))
app.use(express.urlencoded({extended: false}))
// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// subir archivos
app.use(fileUpload({
  limits: { fileSize: 5242880 },
  abortOnLimit: true,
  responseOnLimit: 'max 5Mb'
}))

// se configura uso de sesiones
// https://github.com/voxpelli/node-connect-pg-simple
/* app.use(session({
  store: new pgSession({
    pool: pool2
  }),
  secret: '****',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
})) */

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



// se configura uso de mensajes flash
// app.use(flash())

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

// nodemon server

// ver detalles de conexion
// heroku logs --tail

// npm start
