const ipRangeCheck = require('ip-range-check')

const userIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress

const userIpCheck = (req, admin) => {
  const ip = userIp(req)

  const ipWhitelist = admin.ipWhitelist ? admin.ipWhitelist.split(',') : []

  if (ipWhitelist && ipWhitelist.length) {
    return ipWhitelist.some(entry => entry === ip || ipRangeCheck(ip, entry) === true)
  }

  return true
}

module.exports = {
  userIp,
  userIpCheck
}
