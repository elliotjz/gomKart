const elo = require('./elo-calculations')

const tournament = {
  scoreHistory: [
    {
      name: "_comp",
      scores: {"0": -200, "1": 0, "2": 0, "3": 30 },
      active: true
    },
    {
      name: "jake",
      scores: {"0": 200, "1": 508 },
      active: true
    },
    {
      name: "ez",
      scores: {"0": 200, "3": 437 },
      active: true
    },
    {
      name: "harps",
      scores: {"0": 200, "2": 336 },
      active: true
    },
  ],
  name: "GOM",
  code: "Y6I5P8JXIM",
  raceCounter: 8,
}

const places = {
  ez: '1',
  jake: '2',
  harps: '10',
}

console.log(elo.getUpdatedScoreHistory(tournament, places))
