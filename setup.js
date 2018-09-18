import logger from './core/logger/app-logger'
import mongoConnect from './db/connect'
import config from './core/config/config.dev'

import User from './models/user.model'

mongoConnect()

var user = new User({
    email: config.user.email,
    admin: true,
    username: config.user.name,
    password: config.user.password,
})

user.save(function (err, user) {
    if (!err) {
        logger.info('New user - %s:%s', user.username, user.password)
    } else {
        logger.error(err)
    }
    process.exit(process.pid)
})
