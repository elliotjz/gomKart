const router = require('express').Router()

router.get('/login', (req, res) => {
  console.log('login')
  res.render('login')
})

// auth logout
router.get('/logout', (req, res) => {
  // TODO: hand with passport
  console.log('logout')
  res.send('logging out')
})

router.get('/google', (req, res) => {
  // handle with passport
  console.log('google')
  res.send("logging in with google")
})


module.exports = router
