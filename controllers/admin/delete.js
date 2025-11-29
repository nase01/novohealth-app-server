const { Admin, AdminLog, AdminDeleted } = require('../../models/sequelize')
const { userIp } = require('../../utils/userIp.js')

const adminDelete = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin

    if (!req.body.ids.every(id => typeof (id) === 'number')) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'There was an issue with your request.' }] })
    }

    if (req.body.ids.includes(currentAdmin.id)) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Cannot delete own account.' }] })
    }

    const targetAdmin = await Admin.findAndCountAll({ where: { id: req.body.ids } })
    if (targetAdmin.count !== req.body.ids.length) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'At least one ID is invalid.' }] })
    }

    const deleted = await Admin.destroy({ where: { id: req.body.ids } })

    if (deleted) {
      const results = await Promise.all(req.body.ids.map((id) => {
        const adminLog = new AdminLog({
          activityInfo: `${currentAdmin.name} deleted admin ${id}.`,
          adminId: currentAdmin.id,
          email: currentAdmin.email,
          ipAddress: ip
        })

        // Save ID of deleted admins since logs linked to IDs will be kept
        const adminDeleted = new AdminDeleted({ adminId: id })

        adminLog.save()
        adminDeleted.save()

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
  adminDelete
}
