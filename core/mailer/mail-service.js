import logger from '../logger/app-logger'
import config from '../config/config.dev'

var jwt = require('jsonwebtoken')
var ExtractJwt = require('passport-jwt').ExtractJwt
var mailjet = require('node-mailjet').connect(config.mailjetApiKey, config.mailjetApiSecret)

var jwtOpts = {}

jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOpts.secretOrKey = config.secretOrKey

let mailService = {}

mailService.newAccount = (user) => {
    const payload = { id: user.id }
    const token = jwt.sign(payload, jwtOpts.secretOrKey, jwtOpts.jsonWebTokenOptions)
    return mailjet
    .post('send')
    .request({
        'FromEmail': 'me@boubaks.com',
        'FromName': 'boubaks',
        'Subject': 'Boubaks: your account has been created',
        'Html-part': `Hello,<br/>Your "Boubaks" account has been successfully created!<br/> 
                      To set your password, please use the following link: <a href="https://boubaks.com/set-password?token=${user.tokenPassword}">https://boubaks.com/set-password?token=${user.tokenPassword}</a>
                      <br/><br/>Best regards,<br/>Boubaks`,
        'To': user.email
    })
    logger.info('newAccount-jwt', { payload: payload, token: token, email: user.email })
}

mailService.requestPassword = (userEmail, token) => {
    logger.info('requestPassword' + token)
    return mailjet
        .post('send')
        .request({
            'FromEmail': 'me@boubaks.com',
            'FromName': 'boubaks',
            'Subject': 'Boubaks: Request a new password',
            'Html-part': `Hello,<br/>To reset your password, please use the following <a href="https://boubaks.com/set-password?token=${token}">link</a>
                          <br/><br/>Best regards,<br/>Boubaks`,
            'To': userEmail
        })
}

mailService.passwordChanged = (userEmail) => {
    logger.info('mail service => passwordChanged', userEmail)
    return mailjet
        .post('send')
        .request({
            'FromEmail': 'me@boubaks.com',
            'FromName': 'boubaks',
            'Subject': 'Boubaks: Password changed',
            'Html-part': `Hello,<br/>Your password has been successfully changed!
                          <br/><br/>Best regards,<br/>Boubaks`,
            'To': userEmail
        })
}

export default mailService