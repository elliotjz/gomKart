const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')

const passportSetup = require('./config/passport-setup')
const routes = require('./routes')


// Get app secrets
let keys
let production
try {
  keys = require('./config/keys')
  production = false
} catch(e) {
  production = true
}

const app = express()

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))


// Middleware
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [production ? process.env.sessionCookieKey : keys.session.cookieKey]
}))
app.use(passport.initialize())
app.use(passport.session())

const jsonParser = bodyParser.json()


// Connect to mongodb
const uri = production ? process.env.mongodbURI : keys.mongodb.dbURI
console.log(production)
console.log(uri)
mongoose.connect(uri, () => {
  console.log('connected to mongodb')
})

// setup routes
routes(app, jsonParser)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log(`GOM KART listening on ${port}`)
