import express from 'express'
import viewController from '../controllers/views.controller'
const router = express.Router()

router.get('/', async (req, res) => {
    viewController.index(req, res)
})

router.get('/login', (req, res) => {
    viewController.login(req, res)
})

/*
router.get('/poc', (req, res) => {
    viewController.poc(req, res)
})
*/

export default router
