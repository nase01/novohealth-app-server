
const { isName } = require('./lib/isName.js')
const { isAddressString } = require('./lib/isAddressString.js')
const { isContactNumber } = require('./lib/isContactNumber.js')
const { isBranchName } = require('./lib/isBranchName.js')
const { isPrice } = require('./lib/isPrice.js')
const { isNumber } = require('./lib/isNumber.js')
const { isDate } = require('./lib/isDate.js')

module.exports = {
  isName,
  isAddressString,
  isContactNumber,
  isBranchName,
  isNumber,
  isPrice,
  isDate,
}
