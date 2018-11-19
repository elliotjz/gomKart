const mongoose = require('mongoose')
const Schema = mongoose.Schema

const raceSchema = new Schema({
  raceNumber: Number,
  user: String, // foreign key for user's googleID
  places: Array,
  data: Date
})

const Race = mongoose.model('user', raceSchema)

module.exports = Race
