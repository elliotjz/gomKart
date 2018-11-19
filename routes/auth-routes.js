const passport = require('passport')

module.exports = (app) => {
  app.get('/auth/login', (req, res) => {
    console.log('login')
    res.render('login')
  })

  // auth logout
  app.get('/auth/logout', (req, res) => {
    // TODO: hand with passport
    req.logout()
    res.redirect('/login')
  })

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  // callback rout for google auth
  app.get(
    '/auth/google/redirect',
    passport.authenticate('google'),
    (req, res) => {
      // res.send(req.user)
      res.redirect('/home')
    }
  )
}
