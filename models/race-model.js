const mongoose = require('mongoose')
const Schema = mongoose.Schema

const raceSchema = new Schema({
  user: String,
  tournament: String,
  places: Array,
  date: Date
})

const Race = mongoose.model('race', raceSchema)

module.exports = Race
