const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
  playerName: String,
  tournament: String,
  eloScore: Number,
  image: String
})

const Player = mongoose.model('user', playerSchema)

module.exports = Player
