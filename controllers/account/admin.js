const bcrypt = require('bcrypt')
const validator = require('validator')
const { adminValidate } = require('../../utils/input-validate/adminValidate.js')
const { userIp } = require('../../utils/userIp.js')
const { AdminLog } = require('../../models/sequelize')
const { strongPwOpts } = require('../../utils/strongPwOpts.js')

const adminAccountUpdate = async (req, res) => {
  try {
    const ip = userIp(req)
    const self = req.currentAdmin

    const validate = await adminValidate(req.body, self.id, self.id)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    const modifiedDetails = []

    if (req.body.name !== self.name) {
      modifiedDetails.push(`Name: ${self.name} -> ${req.body.name}.`)
      self.name = req.body.name
    }

    if (req.body.address !== self.address) {
      modifiedDetails.push(`Name: ${self.address} -> ${req.body.address}.`)
      self.address = req.body.address
    }

    if (self.pwForceChange) {
      self.pwForceChange = false
    }

    if (req.body.email !== self.email) {
      modifiedDetails.push(`Email: ${self.email} -> ${req.body.email}.`)
      self.email = req.body.email
    }

    if (req.body.username !== self.username) {
      modifiedDetails.push(`Username: ${self.username} -> ${req.body.username}.`)
      self.username = req.body.username
    }

    if (req.body.ipWhitelist.length !== self.ipWhitelist.length ||
          !req.body.ipWhitelist.every(ip => self.ipWhitelist.includes(ip))) {
      if (req.body.ipWhitelist.length) {
        modifiedDetails.push('IP whitelist updated.')
      } else {
        modifiedDetails.push('IP whitelist cleared.')
      }

      // Sequelize MySQL cannot accept array as value
      self.ipWhitelist = req.body.ipWhitelist.toString()
    }

    if (req.body.imageURL !== self.imageURL) {
      modifiedDetails.push(`Image URL: ${self.imageURL} -> ${req.body.imageURL}.`)
      self.imageURL = req.body.imageURL
    }

    await self.save()

    const adminLog = new AdminLog({
      activityInfo: `Admin user ${self.name} updated their own account. ${modifiedDetails.join(' ')}`,
      adminId: self.id,
      username: self.username,
      ipAddress: ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: [{ status: '500', detail: error }] })
  }
}


const adminAccountChangePW = async (req, res) => {
  try {
    const ip = userIp(req)
    const self = req.currentAdmin
    
    const correctPass = req.body.password ? await bcrypt.compare(req.body.password, self.password) : false

    if (!correctPass) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Incorrect current password.' }] })
    }
   
    if (await bcrypt.compare(req.body.newPassword, self.password)) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Cannot use current password.' }] })
    }

    // if (!validator.isStrongPassword(req.body.newPassword, strongPwOpts)) {
    //   return res.status(400).json({ errors: [{ status: '400', detail: 'New password must contain at least one uppercase, one lowercase, one number. Password min. length is 8 characters.' }] })
    // }

    if (req.body.newPassword !== req.body.newPasswordConfirm) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Both new password fields must match.'  }] })
    }

    const modifiedDetails = []

    if (self.pwForceChange) {
      self.pwForceChange = false
    }

    if (req.body.newPassword) {
      modifiedDetails.push('Password updated.')
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 12)
      self.password = hashedPassword
    }

    await self.save()

    const adminLog = new AdminLog({
      info: `Admin user ${self.email} (${self.id}) changed their own password. ${modifiedDetails.join(' ')}`,
      actionTaker: { id: self.id, email: self.email },
      ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  adminAccountUpdate,
  adminAccountChangePW
}