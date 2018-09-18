import express from 'express'
import passport from 'passport'

import authController from '../controllers/auth.controller'
const router = express.Router()

router.post('/local/login', ...authController.localLogin)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/me', passport.authenticate('jwt', { session: false }), authController.me)

export default router
