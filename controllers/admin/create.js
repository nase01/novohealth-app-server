const bcrypt = require('bcrypt')
const { adminValidate } = require('../../utils/input-validate/adminValidate.js')
const { Admin, AdminLog } = require('../../models/sequelize')
const { userIp } = require('../../utils/userIp.js')
const moment = require('moment');

const adminCreate = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin

    const validate = await adminValidate(req.body, currentAdmin.id)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const birthday = moment(req.body.birthday).format('YYYY-MM-DD')
    const dateHired = moment(req.body.dateHired).format('YYYY-MM-DD')

    // Sequelize MySQL cannot accept array as value
    const ipWhitelist = req.body.ipWhitelist.toString()

    const admin = new Admin({
      name: req.body.name,
      imageURL: req.body.imageURL,
      address: req.body.address,
      birthday,
      dateHired,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      ipWhitelist,
      role: req.body.role,
      branchId: req.body.branchId,
      active: req.body.active,
      pwForceChange: req.body.pwForceChange,
      baseSalary: req.body.baseSalary,
      baseSSS: req.body.baseSSS,
      baseSSSNo: req.body.baseSSSNo,
      basePagIbig: req.body.basePagIbig,
      basePagIbigNo: req.body.basePagIbigNo,
      basePhilhealth: req.body.basePhilhealth,
      basePhilhealthNo: req.body.basePhilhealthNo,
      employerSSS: req.body.employerSSS,
      employerPagIbig: req.body.employerPagIbig,
      employerPhilhealth: req.body.employerPhilhealth,
    })

    const saved = await admin.save()

    const adminLog = new AdminLog({
      activityInfo: `${currentAdmin.name} created new admin ${saved.name} (${saved.id}).`,
      adminId: currentAdmin.id,
      username: currentAdmin.email,
      ipAddress: ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  adminCreate
}
