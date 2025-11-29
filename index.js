require('dotenv/config')
const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const db = require('./models/sequelize/index').sequelize
const config = require('./config')
const { routerAdmin, routerGithub } = require('./routes/index')

const app = express()

app.enable('trust proxy', 'loopback')

app.use(helmet())
app.use(express.static(path.join(path.resolve(), 'static'), { dotfiles: 'allow' }))
app.use(express.json({ limit: '20mb' })) // for base64 uploads

// CORS
const corsAllowed = config.corsWhitelist.length ? config.corsWhitelist : '*'

const corsOptions = {
  origin: corsAllowed,
  methods: ['HEAD', 'GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
  credentials: true
}

app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

// Router
// use router here
app.use(routerAdmin)
.use(routerGithub)

// Initialize App
;
(async () => {
  try {
    await db.authenticate()
    app.listen(config.port)
  } catch (error) {
    throw new Error(error)
  }
})()

module.exports = app;