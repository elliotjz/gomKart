const passport = require('passport')

module.exports = (app) => {
  app.get('/auth/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
  })

  // send request to google
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  // callback rout for google auth
  app.get(
    '/auth/google/redirect',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/')
    }
  )
}
