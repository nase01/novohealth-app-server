const { Branch, AdminLog } = require('../../models/sequelize')
const { userIp } = require('../../utils/userIp.js')
const { branchValidate } = require('../../utils/input-validate/branchValidate.js')

const branchCreate = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin

    const validate = await branchValidate(req.body, currentAdmin.id)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    const branch = new Branch({
      name: req.body.name,
      address: req.body.address
    })

    const saved = await branch.save()

    const adminLog = new AdminLog({
      activityInfo: `${currentAdmin.name} created new branch ${saved.name} (${saved.id}).`,
      adminId: currentAdmin.id,
      username: currentAdmin.username,
      ipAddress: ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: error }] })
  }
}

module.exports = {
  branchCreate
}
