const { Router } = require('express')
const bcrypt = require('bcrypt')
const { get_user, create_user } = require('../db/users.js')
const { create_message } = require('../db/messages.js') //get_message, 


const router = Router()

let email = ''

let usuario = {
  name: '',
  email: '',
  id: ''
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
    console.log('index ',usuario)
    res.render('index.html', {usuario}) // , { games, toplay })
  } catch (error) {
     console.log(error)
  }
})

// ruta que carga el formulario del login
router.get('/login', (req, res) => {
  // const messages = req.flash()
  // res.render('login.html', { messages })
  res.render('login.html')
})

router.get('/logout', (req, res) => {
  usuario = null 
  name_us = undefined
  res.redirect('/login')
})

router.get('/register', (req, res) => {
  // const messages = req.flash()   
  // res.render('register.html', {messages})
  res.render('register.html')
})

router.post('/login', async (req, res) => {
  // 1. me traigo los dat del formulario
  email = req.body.email.trim()
  const password = req.body.password.trim()

  // 2. intento buscar al usuario en base a su email 
  let user_find = await get_user(email)
  if (!user_find) {
    // req.flash('errors', 'Usuario es inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }

  // 3. verificamos las contraseñas
  const son_coincidentes = await bcrypt.compare(password, user_find.password)
  if (!son_coincidentes) {
    console.log('errors', 'Usuario es inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }
  
  // PARTE FINAL
  /* usuario = {
    name: user_find.name,
    email: user_find.email,
    id: user_find.id,
    is_admin: user_find.is_admin,
    play: false
  } */
  usuario = {
    name: user_find.name,
    email: user_find.email,
    id: user_find.id
  }
  console.log('login ',user_find.name)
  return res.redirect('/')  
})

router.post('/register', async (req, res) => {
  const name = req.body.name.trim()
  email = req.body.email.trim()
  const password = req.body.password.trim()
  const password_repeat = req.body.password_repeat

  // validamos que contraseñas coincidan
  if (password != password_repeat) {
    // req.flash('errors', 'Las contraseñas no coinciden')
    return res.redirect('/register')
  }
  // validamos que no exista otro usuario con ese mismo correo
  const current_user = await get_user(email)
  if (current_user) {
    // req.flash('errors', 'Ese email ya está ocupado')
    console.log('errors', 'Ese email ya está ocupado')
    return res.redirect('/register')
  }
  // 4. Finalmente lo agregamos a la base de dat
  const encrypted_pass = await bcrypt.hash(password, 10)
  await create_user(name, email, encrypted_pass)
  res.redirect('/login')
})

router.post('/message', async (req, res) => {
  console.log('message ')
  const likes = 0
  console.log('message ', req.body.mensaje, email, likes)
  /* if (req.session.mensajes == undefined) {
    req.session.mensajes = []
  } */
  try {
    const mensaje = req.body.mensaje //.trim() //////

    /* console.log('mensaje user id ', mensaje, req.session.user);
    const userEmail = req.session.user.email //// */

    // console.log('userEmail ', userEmail);
    /*  const us_id = await User.findOne({
       where: { email: userEmail }
     }) */
    // console.log('us_id ', us_id);

    await create_message(email, mensaje, likes)

    // const mess = await Message.findAll({ include: 'user', include: 'comment' }); /************** */

    // console.log('mess ', mess);
    /*
    const mess = await Message.findByPk(1, { include: 'user' });
    console.log('mess ', mess);
    console.log('mess *****************',mess.toJSON())
    console.log('obj ', mess.user.firstName);
    */
    // res.send({mess})
    // const messas = []

    /* mess.forEach((item) => {
      // messas.push(item.UserId, item.message, item.createdAt)
      const id = item.id
      const likes = item.likes
      const us = item.user.firstName
      const msj = item.message
      const fecha = item.createdAt
      console.log('id, likes, us, msj, fecha ', id, likes, us, msj, fecha);

      req.session.mensajes.push({ id, likes, us, msj, fecha })
    }) */
    //req.session.mensajes.push({ us, msj, fecha })

    res.redirect('/')

  } catch (error) {
    res.status(400)//.redirect('/')

    // res.status(400).json({ error })
  }
})

router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router, usuario
