const salaryFormula = (data) => {
	// Destructure properties from data
	const {
		compBaseSalary,
		compWorkDays,
		compOvertime,
		compHolidayPay,
		compOthers,
		dedLate,
		dedUndertime,
		dedAdvances,
		dedLoans,
		dedOthers,
		govtSSS,
		govtPhilhealth,
		govtPagIbig,
		govtWTax,
	} = data;

	// Calculate totalPay
	const totalPay = (
		(compBaseSalary * compWorkDays) +
		((compBaseSalary / 540) * compOvertime) +
		compHolidayPay +
		compOthers
	).toFixed(2);

	// Calculate totalDeductions
	const totalDeductions = (
		((compBaseSalary / 540) * dedLate) +
		((compBaseSalary / 540) * dedUndertime) +
		dedUndertime +
		dedAdvances +
		dedLoans +
		dedOthers + 
		govtSSS +
		govtPhilhealth +
		govtPagIbig +
		govtWTax
	).toFixed(2);

	// Calculate netPay
	const netPay = (totalPay - totalDeductions).toFixed(2);

	return {
		totalPay,
		totalDeductions,
		netPay
	};
}

module.exports = {
	salaryFormula
}