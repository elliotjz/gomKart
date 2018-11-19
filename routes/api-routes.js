
const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/login')
  } else {
    next()
  }
}

module.exports = (app, jsonParser) => {
  app.get('/home', (req, res) => {
    if (req.user) {
      // console.log('user is logged in')
      req.next()
    } else {
      res.redirect('/login')
    }
  })

  app.get('/api/profile', (req, res) => {
    console.log("----- REQUEST:")
    console.log(req)
    console.log('--------- REQUEST.USER')
    console.log(req.user)
    
    if (req.user) {
      res.json({
        user: req.user,
      })
      console.log(`sent user data`)
    } else {
      res.json({
        error: 'user is not logged in'
      })
    }
  })

  app.post('/api/add-tournament', (req, res) => {
    res.json(["TODO", "add tournament"])
  })

  app.post('/api/join-tournament', jsonParser, (req, res) => {
    console.log(req.body)
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
