const customValidator = require('../custom-validator')

const branchValidate = async (input, actionTaker, id = null) => {
  if (!input.name || !customValidator.isBranchName(input.name)) {
    return { error: 'Invalid store name.' }
  }
  
  return true
}

module.exports = {
  branchValidate
}
