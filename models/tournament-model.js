const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tournamentSchema = new Schema({
  name: String,
  adminUsers: Array, // foreign keys for user's googleID
})

const Tournament = mongoose.model('user', tournamentSchema)

module.exports = Tournament
