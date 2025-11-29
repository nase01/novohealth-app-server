const express = require('express')
const routerGithub = express.Router()

const { fetchLatest, fetchReleases } = require('../controllers/github/read.js')

routerGithub.get('/:repo/v', fetchLatest)
routerGithub.get('/:repo/releases', fetchReleases)

module.exports = routerGithub
