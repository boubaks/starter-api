import path from 'path'

const config = {}

// Logger
config.logFileDir = path.join(__dirname, '../../log')
config.logFileName = 'app.log'

// MongoDB
config.dbHost = process.env.dbHost || 'localhost'
config.dbPort = process.env.dbPort || '27017'
config.dbName = process.env.dbName || 'boubaks'

// Default User
config.user = {
	email: 'me@boubaks.com',
	name: 'Soufiane B.',
	password: 'password'
}

// Server
config.serverPort = process.env.serverPort || 8080

// Mailjet
config.mailjetApiKey = 'API_KEY'
config.mailjetApiSecret = 'API_SECRET'

// JWT
config.secretOrKey = 'project'

export default config

