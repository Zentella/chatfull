const { Router } = require('express')
const bcrypt = require('bcrypt')
const { get_user, create_user } = require('../db/users.js')
const { get_messages, get_message, update_message, create_message } = require('../db/messages.js')
const { create_comment, get_comments } = require('../db/comments.js')

const router = Router()

// let id_user = 0

let usuario = {
  name: '',
  email: '',
  id: 0
}
let name_us = undefined

// router.get('/ping', get_ping)

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route(req, res, next) {  
  if (!usuario.name) {
    console.log('errors', 'You must log in first')
    return res.redirect('/login')
  }
  next()
}

// index GET
router.get('/', protected_route, async (req, res) => {
  try {

    if (name_us == '' || name_us == 'all') {
      name_us = undefined
    }

    const mensajes = await get_messages()
    const comentarios = await get_comments()

    // console.log('index ',usuario)
    // console.log('mensajes ',mensajes[0].name)

    res.render('index.html', {usuario, mensajes, comentarios})
  } catch (error) {
     console.log(error)
  }
})

// ruta que carga el formulario del login
router.get('/login', (req, res) => {
  res.render('login.html')
})

router.get('/logout', (req, res) => {
  usuario = null 
  name_us = undefined
  res.redirect('/login')
})

router.get('/register', (req, res) => {
  res.render('register.html')
})

router.post('/login', async (req, res) => {
  // 1. me traigo los dat del formulario
  const email = req.body.email.trim()
  const password = req.body.password.trim()

  // 2. intento buscar al usuario en base a su email 
  let user_find = await get_user(email)
  if (!user_find) {
    return res.redirect('/login')
  }

  // 3. verificamos las contraseñas
  const son_coincidentes = await bcrypt.compare(password, user_find.password)
  if (!son_coincidentes) {
    console.log('errors', 'Usuario es inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }
  
  usuario = {
    name: user_find.name,
    email: user_find.email,
    id: user_find.id,
    face: user_find.face,
    face2: user_find.face2,
    hair: user_find.hair,
    hair2: user_find.hair2,
    eyes: user_find.eyes
  }
  console.log('login ',user_find.name)
  return res.redirect('/')  
})

router.post('/register', async (req, res) => {
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  const password_repeat = req.body.password_repeat
  
  const face = Math.floor(Math.random()*16777215).toString(16)
  const face2 = Math.floor(Math.random()*16777215).toString(16)

  const hair = Math.floor(Math.random()*16777215).toString(16)
  const hair2 = Math.floor(Math.random()*16777215).toString(16)

  const eyes = Math.floor(Math.random()*16777215).toString(16)  
  
  // validamos que contraseñas coincidan
  if (password != password_repeat) {
    return res.redirect('/register')
  }
  // validamos que no exista otro usuario con ese mismo correo
  const current_user = await get_user(email)
  if (current_user) {
    console.log('errors', 'Ese email ya está ocupado')
    return res.redirect('/register')
  }
  // 4. Finalmente lo agregamos a la base de dat
  const encrypted_pass = await bcrypt.hash(password, 10)
  await create_user(name, email, encrypted_pass, face, face2, hair, hair2, eyes)
  res.redirect('/login')
})

router.post('/message', protected_route, async (req, res) => {
  console.log('message ')
  const likes = 0
  console.log('message ', req.body.mensaje, usuario.id, likes)
  try {
    const mensaje = req.body.mensaje

    await create_message(usuario.id, mensaje, likes)

    res.redirect('/')

  } catch (error) {
    res.status(400)
  }
})

router.post('/like/:id', protected_route, async (req, res) => {
  let likes
  const id = req.params.id
  console.log('post likesssss');
  console.log('params id ', req.params.id)

    const mess = await get_message(id)
     console.log('mess like ', mess.likes);
     likes = mess.likes + 1

  await update_message(likes, id)

  res.redirect('/')
})

router.post('/comment/:id', protected_route, async (req, res) => {
  try {
    const comentario = req.body.comentario
    const mensaje_id = req.params.id

    console.log('msj_id user_usuario.id comentario ', mensaje_id, usuario.id, comentario)

    await create_comment(usuario.id, mensaje_id, comentario)

    res.redirect('/')

  } catch (error) {
    res.status(400)
  }
})


router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router, usuario
