const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tournamentSchema = new Schema({
  name: String,
  code: String,
  adminUsers: Array,
  raceCounter: Number,
  scoreHistory: Array
})

/*

scoreHistory = [
  {
    "name": "EZ": {
    "scores": { "1": 0,"2": 7,"3": 13,"5": 12,"6": 16,"11": 10 }
  },
  {
    "name": "Martoon": {
    "scores": { "1": 0,"2": 7,"3": 13,"5": 12,"6": 16,"11": 10 }
  }
]

*/
const Tournament = mongoose.model('tournament', tournamentSchema)

module.exports = Tournament
