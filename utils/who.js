const jwt = require('jsonwebtoken')
const config = require('../config')
/**
 *
 * @param {String} authString Value of req.headers.authorization; Bearer <token>
 */

const who = (authString) => {
  if (authString) {
    return jwt.verify(authString.split('Bearer ')[1], config.jwt.secret)
  }

  return null
}

module.exports = {
  who
}
