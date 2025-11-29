const { Admin } = require('../../models/sequelize')
const { who } = require('../../utils/who.js')
const { userIpCheck } = require('../../utils/userIp.js')

// Roles:
// 'super'
// 'admin'
// 'staff'

const adminAuthenticated = async (req, res, next) => {
  const payload = who(req.headers.authorization)

  try {
    if (!payload || payload.accountType !== 'admin') {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized' }] })
    }

    const currentAdmin = await Admin.findOne({ where: { id: payload.id } })

    if (!currentAdmin) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized' }] })
    }

    req.currentAdmin = currentAdmin

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

// all roles
const userAuthorized = (req, res, next) => {
  try {
    if (!req.currentAdmin.active) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    if (!userIpCheck(req, req.currentAdmin)) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized IP address.' }] })
    }

    if (req.currentAdmin.pwForceChange) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

// super admins and admins only
const adminAuthorized = (req, res, next) => {
  try {
    if (req.currentAdmin.role !== 'super' && req.currentAdmin.role !== 'admin') {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

// super admins and staffs only
const staffAuthorized = (req, res, next) => {
  try {
    if (req.currentAdmin.role !== 'super' && req.currentAdmin.role !== 'admin') {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

// super admins only
const superAdminAuthorized = (req, res, next) => {
  try {
    if (req.currentAdmin.role !== 'super') {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  adminAuthenticated,
  adminAuthorized,
  staffAuthorized,
  superAdminAuthorized,
  userAuthorized
}
