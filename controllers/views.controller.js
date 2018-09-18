import User from '../models/user.model'
import paginator from '../core/utils/paginator'
import logger from '../core/logger/app-logger'

const controller = {}

controller.index = async (req, res) => {
    try {
        const users = await User.getAll({}, {})
        if (req.user) {
            console.log('user', req.user)
            return res.render('index', { user: req.user, users: users })
        }
        return res.redirect('/login')
    } catch (err) {
        logger.error('error:views.controller:index - ' + err)
        res.status(500).send(err)
    }
}

controller.login = (req, res) => {
    if (req.user) {
        return res.redirect('/')
    }
    return res.render('login')
}

export default controller