import { v1 } from 'uuid'

import User from '../models/user.model'
import logger from '../core/logger/app-logger'

import mailService from '../core/mailer/mail-service'
import paginator from '../core/utils/paginator'

import languages from '../translations/languages'

const controller = {}

controller.getAll = async (req, res) => {
    const pagination = paginator.fromQuery(req.query)

    const language = req.user.language ? req.user.language : 'en'
    try {
        const users = await User.getAll({}, pagination)
        logger.info('success:users.controller:getAll - ' + users)
        res.send(users)
    } catch (err) {
        logger.error('error:users.controller:getAll - ' + err)
        res.status(500).send({ message: languages[language].getAllUsers })
    }
}

controller.getUser = async (req, res) => {
    const language = req.user.language ? req.user.language : 'en'
    try {
        const user = await User.getUser(req.params.userId)
        logger.info('success:users.controller:getUser - ' + user)
        res.send(user)
    } catch (err) {
        logger.error('error:users.controller:getUser - ' + err)
        res.status(500).send({ message: languages[language].getUser })
    }
}

controller.addUser = async (req, res) => {
    let userToAdd = User({
        email: req.body.email,
        username: req.body.name,
        password: req.body.password
    })
    const language = req.user.language ? req.user.language : 'en'
    try {
        const savedUser = await User.addUser(userToAdd)
        logger.info('success:users.controller:addUser - ' + savedUser)
        res.send(savedUser)
    } catch (err) {
        logger.error('error:users.controller:addUser - ' + err)
        res.status(500).send({ message: languages[language].addUser })
    }
}

controller.updatePassword = async (req, res) => {
    let userId = req.user._id
    let data = {
        password: req.body.password,
        newPassword: req.body.newPassword
    }

    const language = req.user.language ? req.user.language : 'en'
    try {
        const user = await User.getUser(userId)
        if (user.checkPassword(data.password)) {
            const updatePassword = await User.updatePassword(userId, data.newPassword)
            await mailService.passwordChanged(user.email)
            logger.info('success:users.controller:updatePassword - ' + updatePassword)
            res.send(updatePassword)
        } else {
            res.status(403).send({ message: languages[language].invalidPassword })
        }
    } catch (err) {
        logger.error('error:users.controller:updatePassword - ' + err)
        res.status(500).send({ message: languages[language].updatePassword })
    }
}

// update only his own user
controller.updateUser = async (req, res) => {
    let userId = req.user._id
    let userUpdate = req.body

    const language = req.user.language ? req.user.language : 'en'
    try {
        const savedUser = await User.updateUser(userId, userUpdate)
        logger.info('success:users.controller:updateUser - ' + savedUser)
        res.send(savedUser)
    } catch (err) {
        logger.error('error:users.controller:updateUser - ' + err)
        res.status(500).send({ message: languages[language].updateUser })
    }
}

// update only his own user
controller.deleteUser = async (req, res) => {
    let userId = req.user ? req.user._id : null

    const language = req.user.language ? req.user.language : 'en'
    try {
        const removedUser = await User.removeUser(userId)
        logger.info('success:users.controller:deleteUser - ' + removedUser)
        res.send(removedUser)
    } catch (err) {
        logger.error('error:users.controller:deleteUser - ' + err)
        res.status(500).send({ message: languages[language].deleteUser })
    }
}

controller.requestPassword = async (req, res) => {
    let userEmail = req.body.email ? req.body.email : null

    const language = req.body.language ? req.body.language : 'en'
    if (!userEmail) {
        return res.status(500).send({ message: languages[language].missingEmail })
    }
    try {
        const user = await User.get(userEmail)
        if (!user) {
            return res.status(500).send({ message: languages[language].noUserAssociated })
        }
        const updateUser = {
            tokenPassword: v1(),
            tokenValidation: new Date().getTime() + 7200000 // two hours validation
        }
        const update = await User.updateUser(user._id, updateUser)
        await mailService.requestPassword(user.email, updateUser.tokenPassword)
        logger.info('success:users.controller:requestPassword - ' + update)
        res.send(update)
    } catch (err) {
        logger.error('error:users.controller:requestPassword - ' + err)
        res.status(500).send({ message: languages[language].requestPassword })
    }
}

controller.resetPassword = async (req, res) => {
    let userPassword = req.body.password ? req.body.password : null
    let userToken = req.body.token ? req.body.token : null

    const language = req.body.language ? req.body.language : 'en'
    if (!userPassword || !userToken) {
        return res.status(500).send({ message: languages[language].missingFields })
    }
    try {
        const user = await User.getByToken(userToken)
        if (!user) {
            return res.status(500).send({ message: languages[language].noUserAssociated })
        }
        if (!user.tokenPassword || user.tokenValidation < new Date().getTime()) {
            return res.status(500).send({ message: languages[language].expiredToken })
        }
        const update = await User.updatePassword(user._id, userPassword)
        await mailService.passwordChanged(user.email)
        logger.info('success:users.controller:resetPassword - ' + update)
        res.send(update)
    } catch (err) {
        logger.error('error:users.controller:resetPassword - ' + err)
        res.status(500).send({ message: languages[language].resetPassword })
    }
}

export default controller
