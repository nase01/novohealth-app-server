
const customValidator = require('../custom-validator')

const salaryValidate = async (input, actionTaker, id = null) => {
  if (!customValidator.isDate(input.payDate)) {
    return { error: 'payDate must be a valid date (Format: YYYY-MM-DD)' }
  }

  if (!customValidator.isDate(input.payFrom)) {
    return { error: 'payFrom must be a valid date (Format: YYYY-MM-DD)' }
  }

  if (!customValidator.isDate(input.payTo)) {
    return { error: 'payTo must be a valid date (Format: YYYY-MM-DD)' }
  }

  if (input.workDays && !customValidator.isNumber(input.workDays)) {
    return { error: 'Invalid workDays value.' }
  }

  return true
}

module.exports = {
  salaryValidate
}
