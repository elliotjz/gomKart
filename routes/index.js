// const router = require('express').Router()
const apiRoutes = require('./api-routes')
const authRoutes = require('./auth-routes')

module.exports = (app, jsonParser) => {
  apiRoutes(app, jsonParser)
  authRoutes(app)
}
