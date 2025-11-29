const { Bra, AdminLog } = require('../../models/sequelize')
const { userIp } = require('../../utils/userIp.js')

const branchDelete = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin

    if (!req.body.ids.every(id => typeof (id) === 'number')) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'There was an issue with your request.' }] })
    }

    const targetBranch = await Branch.findAndCountAll({ where: { id: req.body.ids } })
    if (targetBranch.count !== req.body.ids.length) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'At least one ID is invalid.' }] })
    }

    const deleted = await Branch.destroy({ where: { id: req.body.ids } })

    if (deleted) {
      const results = await Promise.all(req.body.ids.map((id) => {
        const adminLog = new AdminLog({
          activityInfo: `${currentAdmin.name} deleted Branch ${id}.`,
          adminId: currentAdmin.id,
          email: currentAdmin.email,
          ipAddress: ip
        })

        adminLog.save()
        return 'ok'
      }))

      if (results.every(result => result === 'ok')) {
        return res.status(200).json({ data: { success: true } })
      } else {
        return res.status(400).json({ errors: [{ status: '400', detail: 'There was an issue with your request.' }] })
      }
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  branchDelete
}
