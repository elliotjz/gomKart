
const Tournament = require('../models/tournament-model')
const Race = require('../models/race-model')
const eloCalcs = require('../helpers/elo-calculations')
const COMP_INITIAL_SCORE = -200
const PLAYER_INITIAL_SCORE = 200

function makeTournamentCode() {
  var code = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < 10; i++)
    code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
}

function getCodeFromQueryString(query) {
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (decodeURIComponent(pair[0]) == 'code') {
      return decodeURIComponent(pair[1])
    }
  }
}

function calculateNewScores(tournament, places) {
  let scoreHist = tournament.scoreHistory
  const raceCounter = tournament.raceCounter + 1
  for (player in places) {
    const position = places[player]
    for (let i = 0; i < scoreHist.length; i++) {
      if (player === scoreHist[i].name) {
        scoreHist[i].scores[raceCounter] = 100 * position
      }
    }
  }
  return scoreHist
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
    if (req.user) {
      const code = makeTournamentCode()
      const scoreHistory = [{
        name: "_comp",
        scores: { "0": COMP_INITIAL_SCORE }
      }]
      new Tournament({
        name: req.body.name,
        adminUsers: req.user.email,
        code,
        raceCounter: 0,
        scoreHistory
      }).save().then(() => {
        res.json({ success: true })
      })
    } else {
      res.json({
        success: false,
        error: 'user is not logged in'
      })
    }
  })

  app.get('/api/get-tournaments', (req, res) => {
    if (req.user) {
      Tournament.find({ adminUsers: req.user.email }).then(tournaments => {
        res.json({ tournaments })
      })
    } else {
      res.json({
        error: 'user is not logged in'
      })
    }
  })

  app.get('/api/get-tournament-data', (req, res) => {
    const query = req._parsedUrl.query
    const code = getCodeFromQueryString(query)
    if (code === undefined) {
      res.json({ error: 'Tournament not found' })
    } else {
      Tournament.findOne({ code: code })
      .then(tournament => {
        if (tournament === null) {
          res.json({ error: 'Tournament not found' })
        } else {
          console.log(tournament)
          tournament.scoreHistory.forEach((d) => {
            console.log(d)
          })
          res.json({ tournament })
        }
      })
    }
  })

  app.post('/api/join-tournament', jsonParser, (req, res) => {
    if (req.user) {
      Tournament.findOneAndUpdate(
        { code: req.body.code },
        {$addToSet: { adminUsers: req.user.email }}
      ).then(() => {
        res.json({ success: true })
      })
    } else {
      res.json({
        error: 'user is not logged in'
      })
    }
  })

  app.post('/api/add-player', jsonParser, (req, res) => {
    if (req.user) {
      const scoreHistoryObject = {
        name: req.body.name,
        scores: { "0": PLAYER_INITIAL_SCORE }
      }
      Tournament.findOneAndUpdate(
        { code: req.body.code, adminUsers: req.user.email },
        { $addToSet: { scoreHistory: scoreHistoryObject }},
        {new: true},
        (err, tournament) => {
          if (err) {
            res.json({ error: "error adding player" })
          } else {
            res.json(tournament)
          }
        }
      )
    } else {
      req.json({ error: "You must be logged in to add players. "})
    }
  })

  app.post('/api/add-race', jsonParser, (req, res) => {
    if (req.user) {
      const date = new Date()
      const places = req.body.places

      // Make sure they haven't added a computer player
      if (Object.keys(places).includes("_comp")) {
        res.json({ error: "Player not in tournament" })
        return
      }

      new Race({
        user: req.user.email,
        tournament: req.body.code,
        places,
        date
      }).save().then(() => {
        Tournament.findOne({ code: req.body.code }, (err, tournament) => {
          const raceCounter = tournament.raceCounter + 1
          const scoreHistory = eloCalcs.getUpdatedScoreHistory(tournament, places)
          Tournament.findOneAndUpdate(
            { code: req.body.code },
            { $set: { raceCounter, scoreHistory }},
            {new: true},
            (err, tournament) => {
              if (err) {
                res.json({ error: err })
              } else {
                res.json(tournament)
              }
            }
          )
        })
      })
    }
  })
}
