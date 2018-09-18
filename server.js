import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import passport from 'passport'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import morgan from 'morgan'
import Twig from 'twig'

import logger from './core/logger/app-logger'
import config from './core/config/config.dev'

import './controllers/auth.controller'

import auth from './routes/auth.route'
import users from './routes/users.route'
import views from './routes/views.route'

import mongoConnect from './db/connect'

const port = config.serverPort

logger.stream = {
    write: function(message, encoding){
        logger.info(message)
    }
}

mongoConnect()

const app = express()

// App settings
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev', { 'stream': logger.stream }))

// App render settings
app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
})
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Static access
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/uploads', express.static(__dirname + '/uploads'))

// Passport & Sessions/Cookies
app.use(cookieParser())
app.use(session({ secret: 'boubaks', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.initialize())

// Routes
app.use('/', views)
app.use('/user(s)?', users)
app.use('/auth', auth)

app.listen(port, () => {
    logger.info('server started - ', port)
})