const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

// Get app secrets
let keys
let production
try {
  keys = require('./keys')
  production = false
} catch(e) {
  production = true
}

const User = require('../models/user-model')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: production ? process.env.googleClientID : keys.google.clientID,
    clientSecret: production ? process.env.googleClientSecret : keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    // Check if user exists
    User.findOne({googleID: profile.id}).then((currentUser) => {
      if (currentUser) {
        // user already created
        done(null, currentUser)
      } else {
        // create new user
        const imageURL = profile.photos.length > 0 ?
          profile.photos[0].value : ""
        const email = profile.emails.length > 0 ?
          profile.emails[0].value : ""
        new User({
          username: profile.displayName,
          googleID: profile.id,
          imageURL,
          email
        }).save().then((newUser) => {
          done(null, newUser)
        })
      }
    })
  })
)
