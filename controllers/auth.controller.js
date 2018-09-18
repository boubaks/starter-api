import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/user.model'

import config from '../core/config/config.dev'

import languages from '../translations/languages'

var jwtOpts = {}

jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOpts.secretOrKey = config.secretOrKey

const JWTdeserializeUser = (jwtUser, done) => {
    // get user after done on Local or Jwt Strategies
    User.findOne({ _id: jwtUser.id }, function(err, user) {
        if (user && (!user.updated || Math.round(user.updated.getTime() / 1000) < jwtUser.iat)) {
            done(null, user)
        } else {
            done(null, false, { message: 'Invalid token' })
        }
    })
}
// JWT Strategy - passport
passport.use(
    new JwtStrategy(jwtOpts, function(jwtPayload, done) {
        // If the token has expiration, raise unauthorized
        const expirationDate = new Date(jwtPayload.exp * 1000)
        if (expirationDate < new Date()) {
            return done(null, false)
        }
        const user = jwtPayload
        JWTdeserializeUser(user, done)
    })
)

// Local Strategy - passport
passport.use(
    new LocalStrategy(function(username, password, done) {
        User.findOne({ email: username }, function(err, user) {
            // error
            if (err) {
                return done(err)
            }
            // if no user
            if (!user) {
                return done(null, false)
            }
            /*
            // if user is not admin
            if (!user.admin) {
                return done(null, false)
            }
            */
            // if user found but invalid password
            if (!user.checkPassword(password)) {
                return done(null, false)
            }

            return done(null, user)
        })
    })
)

// User serialization
passport.serializeUser(function(user, done) {
    done(null, user.id)
})

// User deserialization
passport.deserializeUser(function(id, done) {
    // get user after done on Local or Jwt Strategies
    User.findOne({ _id: id }, function(err, user) {
        if (user) {
            done(null, user)
        } else {
            done(null, id)
        }
    })
})

const redirectLogin = (req, res) => {
    // redirect on home when success login
    res.redirect('/')
}

const controller = {}

controller.localLogin = [passport.authenticate('local', { failureRedirect: '/login' }), redirectLogin]

// JWT strategy login
controller.login = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const language = req.query.language ? req.query.language : 'en'
    User.findOne({ email: email }, function(err, user) {
        // error
        if (err) {
            return res.status(500).send({ message: languages[language].authError })
        }
        // if no user
        if (!user) {
            return res.status(401).send({ message: languages[language].invalidUser })
        }
        // if user found but invalid password
        if (user && !user.checkPassword(password)) {
            return res.status(401).send({ message: languages[language].invalidPassword })
        }

        var payload = { id: user.id, email: email }
        var token = jwt.sign(payload, jwtOpts.secretOrKey, jwtOpts.jsonWebTokenOptions)

        res.json({
            message: 'ok',
            token: token
        })
    })
}

// Logout and destroy session
controller.logout = (req, res) => {
    req.logout()
    req.session.destroy()
    res.redirect('/')
}

controller.me = (req, res) => {
    res.send(req.user)
}

export default controller