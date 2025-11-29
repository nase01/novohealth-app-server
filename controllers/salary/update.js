const { Salary, AdminLog, Admin } = require('../../models/sequelize')
const { userIp } = require('../../utils/userIp.js')
const moment = require('moment');
const { salaryValidate } = require('../../utils/input-validate/salaryValidate.js')  
const { salaryFormula } = require('../../utils/salaryFormula.js');

const salaryUpdate = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin
    const salary = await Salary.findOne({ where: { id: req.params.id } })
		
    if (!salary) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Salary you want to edit does not exist.' }] })
    }

		const validate = await salaryValidate(req.body, currentAdmin.id)
 
    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

		const salaryOwner = await Admin.findOne({ where: { id: salary.adminId } })

    const modifiedDetails = []

		const { totalPay, totalDeductions, netPay } = salaryFormula(req.body);
		
		const payDate = moment(req.body.payDate).format('YYYY-MM-DD')
		const payFrom = moment(req.body.payFrom).format('YYYY-MM-DD')
		const payTo = moment(req.body.payTo).format('YYYY-MM-DD')

		if (payDate !== salary.payDate) {
      modifiedDetails.push(`Pay Date: ${moment(salary.payDate).format('YYYY-MM-DD')} -> ${payDate}.`)
      salary.payDate = payDate
    }

		if (payFrom !== salary.payFrom) {
      modifiedDetails.push(`Pay From: ${moment(salary.payFrom).format('YYYY-MM-DD')} -> ${payFrom}.`)
      salary.payFrom = payFrom
    }

		if (payTo !== salary.payTo) {
      modifiedDetails.push(`Pay To: ${moment(salary.payTo).format('YYYY-MM-DD')} -> ${payTo}.`)
      salary.payTo = payTo
    }

    if (req.body.compBaseSalary !== salary.compBaseSalary) {
      modifiedDetails.push(`Base Salary: ${salary.compBaseSalary} -> ${req.body.compBaseSalary}.`)
      salary.compBaseSalary = req.body.compBaseSalary
    }

		if (req.body.compWorkDays !== salary.compWorkDays) {
      modifiedDetails.push(`Work Days: ${salary.compWorkDays} -> ${req.body.compWorkDays}.`)
      salary.compWorkDays = req.body.compWorkDays
    }

		if (req.body.compBrokenDays !== salary.compBrokenDays) {
      modifiedDetails.push(`Broken Days: ${salary.compBrokenDays} -> ${req.body.compBrokenDays}.`)
      salary.compBrokenDays = req.body.compBrokenDays
    }

		if (req.body.compOvertime !== salary.compOvertime) {
      modifiedDetails.push(`Overtime: ${salary.compOvertime} -> ${req.body.compOvertime}.`)
      salary.compOvertime = req.body.compOvertime
    }

		if (req.body.compOthers !== salary.compOthers) {
      modifiedDetails.push(`Comp. Others: ${salary.compOthers} -> ${req.body.compOthers}.`)
      salary.compOthers = req.body.compOthers
    }

		if (req.body.dedLate !== salary.dedLate) {
      modifiedDetails.push(`Late: ${salary.dedLate} -> ${req.body.dedLate}.`)
      salary.dedLate = req.body.dedLate
    }

		if (req.body.dedUndertime !== salary.dedUndertime) {
      modifiedDetails.push(`Undertime: ${salary.dedUndertime} -> ${req.body.dedUndertime}.`)
      salary.dedUndertime = req.body.dedUndertime
    }

		if (req.body.shortCashier !== salary.shortCashier) {
      modifiedDetails.push(`Short Cashier: ${salary.shortCashier} -> ${req.body.shortCashier}.`)
      salary.shortCashier = req.body.shortCashier
    }

		if (req.body.shortGCash !== salary.shortGCash) {
      modifiedDetails.push(`Short GCash: ${salary.shortGCash} -> ${req.body.shortGCash}.`)
      salary.shortGCash = req.body.shortGCash
    }

		if (req.body.shortPayMaya !== salary.shortPayMaya) {
      modifiedDetails.push(`Short PayMaya: ${salary.shortPayMaya} -> ${req.body.shortPayMaya}.`)
      salary.shortPayMaya = req.body.shortPayMaya
    }

		if (req.body.shortInventory !== salary.shortInventory) {
      modifiedDetails.push(`Short Intentory: ${salary.shortInventory} -> ${req.body.shortInventory}.`)
      salary.shortInventory = req.body.shortInventory
    }

		if (req.body.shortCashAdvance !== salary.shortCashAdvance) {
      modifiedDetails.push(`Short Cash Advance: ${salary.shortCashAdvance} -> ${req.body.shortCashAdvance}.`)
      salary.shortCashAdvance = req.body.shortCashAdvance
    }

		if (req.body.shortPurchased !== salary.shortPurchased) {
      modifiedDetails.push(`Short Purchased Item: ${salary.shortPurchased} -> ${req.body.shortPurchased}.`)
      salary.shortPurchased = req.body.shortPurchased
    }

		if (req.body.shortOthers !== salary.shortOthers) {
      modifiedDetails.push(`Short Others: ${salary.shortOthers} -> ${req.body.shortOthers}.`)
      salary.shortOthers = req.body.shortOthers
    }

		if (req.body.govtSSS !== salary.govtSSS) {
      modifiedDetails.push(`Govt. SSS: ${salary.govtSSS} -> ${req.body.govtSSS}.`)
      salary.govtSSS = req.body.govtSSS
    }

		if (req.body.govtPhilhealth !== salary.govtPhilhealth) {
      modifiedDetails.push(`Govt. Philhealth: ${salary.govtPhilhealth} -> ${req.body.govtPhilhealth}.`)
      salary.govtPhilhealth = req.body.govtPhilhealth
    }

		if (req.body.govtPagIbig !== salary.govtPagIbig) {
      modifiedDetails.push(`Govt. PagIbig: ${salary.govtPagIbig} -> ${req.body.govtPagIbig}.`)
      salary.govtPagIbig = req.body.govtPagIbig
    }

    if (req.body.emprSSS !== salary.emprSSS) {
      modifiedDetails.push(`Employer Share SSS: ${salary.emprSSS} -> ${req.body.emprSSS}.`)
      salary.emprSSS = req.body.emprSSS
    }

    if (req.body.emprPagIbig !== salary.emprPagIbig) {
      modifiedDetails.push(`Employer Share PagIbig: ${salary.emprPagIbig} -> ${req.body.emprPagIbig}.`)
      salary.emprPagIbig = req.body.emprPagIbig
    }

    if (req.body.emprPhilhealth !== salary.emprPhilhealth) {
      modifiedDetails.push(`Employer Share Philhealth: ${salary.emprPhilhealth} -> ${req.body.emprPhilhealth}.`)
      salary.emprPhilhealth = req.body.emprPhilhealth
    }

		if (totalPay !== salary.totalPay) {
      modifiedDetails.push(`Total Pay: ${salary.totalPay} -> ${totalPay}.`)
      salary.totalPay = totalPay
    }

		if (totalDeductions !== salary.totalDeductions) {
      modifiedDetails.push(`Total Deductions: ${salary.totalDeductions} -> ${totalDeductions}.`)
      salary.totalDeductions = totalDeductions
    }

		if (netPay !== salary.netPay) {
      modifiedDetails.push(`Net Pay: ${salary.netPay} -> ${netPay}.`)
      salary.netPay = netPay
    }

    if (req.body.remarks !== salary.remarks) {
      modifiedDetails.push(`Remarks: ${salary.netPay} -> ${req.body.remarks}.`)
      salary.remarks = req.body.remarks
    }

    await salary.save()

    const adminLog = new AdminLog({
      activityInfo: `${currentAdmin.name} Updated the ${moment(salary.payDate).format('YYYY-MM-DD')} salary of ${salaryOwner.name}, Id:(${salary.id}). ${modifiedDetails.join(' ')}`,
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
  salaryUpdate
}
