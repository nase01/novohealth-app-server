const bcrypt = require('bcrypt')
const { adminValidate } = require('../../utils/input-validate/adminValidate.js')
const { Admin, AdminLog } = require('../../models/sequelize')
const { userIp } = require('../../utils/userIp.js')

const adminUpdate = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin
    const admin = await Admin.findOne({ where: { id: req.params.id } })

    if (!admin) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Admin does not exist.' }] })
    }

    if (admin.id === currentAdmin.id) {
      return res.status(400).json({
        errors: [{
          status: '400',
          detail: 'Modify account on your account settings page.'
        }]
      })
    }

    const validate = await adminValidate(req.body, currentAdmin.id, admin.id)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    const modifiedDetails = []

    if (req.body.name !== admin.name) {
      modifiedDetails.push(`Name: ${admin.name} -> ${req.body.name}.`)
      admin.name = req.body.name
    }

    if (req.body.address !== admin.address) {
      modifiedDetails.push(`Address: ${admin.address} -> ${req.body.address}.`)
      admin.address = req.body.address
    }

    if (req.body.birthday !== admin.birthday) {
      modifiedDetails.push(`Birthday: ${admin.birthday} -> ${req.body.birthday}.`)
      admin.birthday = req.body.birthday
    }

    if (req.body.dateHired !== admin.dateHired) {
      modifiedDetails.push(`Date Hired: ${admin.dateHired} -> ${req.body.dateHired}.`)
      admin.dateHired = req.body.dateHired
    }

    if (req.body.email !== admin.email) {
      modifiedDetails.push(`Email: ${admin.email} -> ${req.body.email}.`)
      admin.email = req.body.email
    }

    if (req.body.username !== admin.username) {
      modifiedDetails.push(`Username: ${admin.username} -> ${req.body.username}.`)
      admin.username = req.body.username
    }

    if (req.body.password) {
      modifiedDetails.push('Password updated.')
      const hashedPassword = await bcrypt.hash(req.body.password, 12)
      admin.password = hashedPassword
    }

    if (req.body.ipWhitelist.length !== admin.ipWhitelist.length ||
          !req.body.ipWhitelist.every(ip => admin.ipWhitelist.includes(ip))) {
      if (req.body.ipWhitelist.length) {
        modifiedDetails.push('IP whitelist updated.')
      } else {
        modifiedDetails.push('IP whitelist cleared.')
      }

      // Sequelize MySQL cannot accept array as value
      admin.ipWhitelist = req.body.ipWhitelist.toString()
    }

    if (req.body.role !== admin.role) {
      modifiedDetails.push(`Admin type: ${admin.role} -> ${req.body.role}.`)
      admin.role = req.body.role
    }

    if (req.body.branchId !== admin.branchId) {
      modifiedDetails.push(`Branch Id: ${admin.branchId} -> ${req.body.branchId}.`)
      admin.branchId = req.body.branchId
    }

    if (req.body.active !== admin.active) {
      modifiedDetails.push(`Status: ${admin.active} -> ${req.body.active}.`)
      admin.active = req.body.active
    }

    if (req.body.pwForceChange !== admin.pwForceChange) {
      modifiedDetails.push(`Password force change: ${admin.pwForceChange} -> ${req.body.pwForceChange}.`)
      admin.pwForceChange = req.body.pwForceChange
    }

    if (req.body.imageURL !== admin.imageURL) {
      modifiedDetails.push(`Image URL: ${admin.imageURL} -> ${req.body.imageURL}.`)
      admin.imageURL = req.body.imageURL
    }

    if (req.body.baseSalary !== admin.baseSalary) {
      modifiedDetails.push(`Base Salary: ${admin.baseSalary} -> ${req.body.baseSalary}.`)
      admin.baseSalary = req.body.baseSalary
    }

    if (req.body.baseSSS !== admin.baseSSS) {
      modifiedDetails.push(`Base SSS: ${admin.baseSSS} -> ${req.body.baseSSS}.`)
      admin.baseSSS = req.body.baseSSS
    }

    if (req.body.baseSSSNo !== admin.baseSSSNo) {
      modifiedDetails.push(`Base SSS No: ${admin.baseSSSNo} -> ${req.body.baseSSSNo}.`)
      admin.baseSSSNo = req.body.baseSSSNo
    }

    if (req.body.basePagIbig !== admin.basePagIbig) {
      modifiedDetails.push(`Base PagIbig: ${admin.basePagIbig} -> ${req.body.basePagIbig}.`)
      admin.basePagIbig = req.body.basePagIbig
    }

    if (req.body.basePagIbigNo !== admin.basePagIbigNo) {
      modifiedDetails.push(`Base PagIbig No: ${admin.basePagIbigNo} -> ${req.body.basePagIbigNo}.`)
      admin.basePagIbigNo = req.body.basePagIbigNo
    }

    if (req.body.basePhilhealth !== admin.basePhilhealth) {
      modifiedDetails.push(`Base Philhealth: ${admin.basePhilhealth} -> ${req.body.basePhilhealth}.`)
      admin.basePhilhealth = req.body.basePhilhealth
    }

    if (req.body.basePhilhealthNo !== admin.basePhilhealthNo) {
      modifiedDetails.push(`Base Philhealth No: ${admin.basePagIbigNo} -> ${req.body.basePhilhealthNo}.`)
      admin.basePhilhealthNo = req.body.basePhilhealthNo
    }

    if (req.body.employerSSS !== admin.employerSSS) {
      modifiedDetails.push(`Employer Philhealth Share: ${admin.employerSSS} -> ${req.body.employerSSS}.`)
      admin.employerSSS = req.body.employerSSS
    }

    if (req.body.basePhilhealthNo !== admin.basePhilhealthNo) {
      modifiedDetails.push(`basePagIbigNo: ${admin.basePhilhealthNo} -> ${req.body.basePhilhealthNo}.`)
      admin.basePhilhealthNo = req.body.basePhilhealthNo
    }

     if (req.body.employerSSS !== admin.employerSSS) {
      modifiedDetails.push(`Employer SSS Share: ${admin.employerSSS} -> ${req.body.employerSSS}.`)
      admin.employerSSS = req.body.employerSSS
    }

    if (req.body.employerPagIbig !== admin.employerPagIbig) {
      modifiedDetails.push(`Employer PagIbig Share: ${admin.employerPagIbig} -> ${req.body.employerPagIbig}.`)
      admin.employerPagIbig = req.body.employerPagIbig
    }

    if (req.body.employerPhilhealth !== admin.employerPhilhealth) {
      modifiedDetails.push(`Employer Philhealth Share: ${admin.employerPhilhealth} -> ${req.body.employerPhilhealth}.`)
      admin.employerPhilhealth = req.body.employerPhilhealth
    }

    await admin.save()

    const adminLog = new AdminLog({
      activityInfo: `${currentAdmin.name} updated admin account ${admin.name} (${admin.id}). ${modifiedDetails.join(' ')}`,
      adminId: currentAdmin.id,
      email: currentAdmin.email,
      ipAddress: ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  adminUpdate
}
