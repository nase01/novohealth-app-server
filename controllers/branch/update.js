const { Branch, AdminLog } = require('../../models/sequelize')
const { userIp } = require('../../utils/userIp.js')
const { branchValidate } = require('../../utils/input-validate/branchValidate.js')

const branchUpdate = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin
    const targetBranch = await Branch.findOne({ where: { id: req.params.id } })

    if (!targetBranch) {
      return res.status(400).json({
        errors: [{ status: '400', detail: 'Branch does not exist.' }]
      })
    }

    const validate = await branchValidate(req.body, currentAdmin.id, targetBranch.id)

    if (validate !== true) {
      return res.status(400).json({
        errors: [{ status: '400', detail: validate.error }]
      })
    }

    const modifiedDetails = []

    if (req.body.name !== targetBranch.name) {
      modifiedDetails.push(`Name: ${targetBranch.name} -> ${req.body.name}.`)
      targetBranch.name = req.body.name
    }

    if (req.body.address !== targetBranch.address) {
      modifiedDetails.push(`Address: ${targetBranch.address} -> ${req.body.address}.`)
      targetBranch.address = req.body.address
    }

    await targetBranch.save()

    const adminLog = new AdminLog({
      activityInfo: `${currentAdmin.name} updated branch ${targetBranch.name} (${targetBranch.id}). ${modifiedDetails.join(
        ' '
      )}`,
      adminId: currentAdmin.id,
      email: currentAdmin.email,
      ipAddress: ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({
      errors: [{ status: '500', detail: 'Internal Server Error' }]
    })
  }
}

module.exports = {
  branchUpdate
}
