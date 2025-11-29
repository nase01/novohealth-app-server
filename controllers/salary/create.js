const { salaryValidate } = require('../../utils/input-validate/salaryValidate.js')
const { Salary, Admin, Store, AdminLog } = require('../../models/sequelize')
const { userIp } = require('../../utils/userIp.js')
const { salaryFormula } = require('../../utils/salaryFormula.js');
const moment = require('moment');

const salaryCreate = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin

    const validate = await salaryValidate(req.body, currentAdmin.id)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    const employee =  await Admin.findOne({ where: { id: req.body.adminId } }) 
    if (!employee) {
        return res.status(400).json({ errors: [{ status: '400', detail: 'adminId not found' }] });
    }

    const store =  await Store.findOne({ where: { id: req.body.storeId } }) 
    if (!store) {
        return res.status(400).json({ errors: [{ status: '400', detail: 'storeId not found' }] });
    }

		const { totalPay, totalDeductions, netPay } = salaryFormula(req.body);
		
		const payDate = moment(req.body.payDate).format('YYYY-MM-DD')
		const payFrom = moment(req.body.payFrom).format('YYYY-MM-DD')
		const payTo = moment(req.body.payTo).format('YYYY-MM-DD')

    const salary = new Salary({
			adminId: req.body.adminId,
      storeId: req.body.storeId,
			payDate,
			payFrom,
			payTo,
      compBaseSalary: req.body.compBaseSalary,
      compWorkDays: req.body.compWorkDays,
      compBrokenDays: req.body.compBrokenDays,
      compOvertime: req.body.compOvertime,
      compOthers: req.body.compOthers,
      totalPay,
      dedLate: req.body.dedLate,   
			dedUndertime: req.body.dedUndertime,   
			shortCashier: req.body.shortCashier,   
			shortGCash: req.body.shortGCash,   
			shortPayMaya: req.body.shortPayMaya,
			shortInventory: req.body.shortInventory,
			shortCashAdvance: req.body.shortCashAdvance,
			shortOthers: req.body.shortOthers,
			govtSSS: req.body.govtSSS,
			govtPhilhealth: req.body.govtPhilhealth,
			govtPagIbig: req.body.govtPagIbig,
      emprSSS: req.body.emprSSS,
			emprPhilhealth: req.body.emprPhilhealth,
			emprPagIbig: req.body.emprPagIbig,
			totalDeductions,
			netPay,
      remarks: req.body.remarks,
			createdBy: currentAdmin.id
    })

    const saved = await salary.save()

    const adminLog = new AdminLog({
      activityInfo: `${currentAdmin.name} Created ${payDate} salary amounting to ${saved.netPay} for ${employee.name} (trId: ${saved.id}).`,
      adminId: currentAdmin.id,
      username: currentAdmin.username,
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
  salaryCreate
}
