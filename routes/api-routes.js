
const Tournament = require('../models/tournament-model')

const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/login')
  } else {
    next()
  }
}

function makeTournamentCode() {
  var code = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < 10; i++)
    code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
}

module.exports = (app, jsonParser) => {
  app.get('/home', (req, res) => {
    if (req.user) {
      req.next()
    } else {
      res.redirect('/login')
    }
  })

  app.get('/api/profile', (req, res) => {
    if (req.user) {
      res.json({
        user: req.user,
      })
    } else {
      res.json({
        error: 'user is not logged in'
      })
    }
  })

  app.post('/api/new-tournament', jsonParser, (req, res) => {
    console.log(req.body)
    if (req.user) {
      const code = makeTournamentCode()
      new Tournament({
        name: req.body.name,
        adminUsers: req.user.email,
        code
      }).save().then(() => {
        res.json({
          success: true
        })
      })
    } else {
      res.json({
        success: false,
        error: 'user is not logged in'
      })
    }
  })

  app.post('/api/join-tournament', jsonParser, (req, res) => {
    res.json(["TODO", "join tournament"])
  })

  app.post('/api/add-player', (req, res) => {
    res.json(["TODO", "add player"])
  })

  app.post('/api/add-race', (req, res) => {
    res.json(["TODO", "add race"])
  })

  app.post('/api/add-player', (req, res) => {
    res.json(["TODO", "add player"])
  })

  app.get('/api/get-scores', (req, res) => {
    res.json(["TODO", "get scores"])
  })
}
