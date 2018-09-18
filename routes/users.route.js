import passport from 'passport'
import express from 'express'

import userController from '../controllers/users.controller'

const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    userController.getAll(req, res)
})

router.get('/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
    userController.getUser(req, res)
})

router.post('/', (req, res) => {
    userController.addUser(req, res)
})

router.post('/request-password', (req, res) => {
    userController.requestPassword(req, res)
})

router.put('/reset-password?', (req, res) => {
    userController.resetPassword(req, res)
})

router.put('/change-password?', passport.authenticate('jwt', { session: false }), (req, res) => {
    userController.updatePassword(req, res)
})

router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    userController.updateUser(req, res)
})

router.delete('/', (req, res) => {
    userController.deleteUser(req, res)
})

export default router
