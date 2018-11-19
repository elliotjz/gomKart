const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tournamentSchema = new Schema({
  name: String,
  adminUsers: Array,
  code: String
})

const Tournament = mongoose.model('tournament', tournamentSchema)

module.exports = Tournament
