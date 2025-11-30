
const validator = require('validator')
const bcrypt = require('bcrypt')

const { Admin, Branch } = require('../../models/sequelize')
// const { strongPwOpts } = require('../strongPwOpts.js')
const customValidator = require('../custom-validator')

const adminValidate = async (input, actionTaker, id = null) => {
  const self = actionTaker === id
  const actionTarget = id ? await Admin.findOne({ where: { id } }) : null
  const store = !self ? await Branch.findOne({ where: { id: input.branchId } }) : true

  if (self) {
    if (actionTarget.pwForceChange && !input.newPassword) {
      return { error: 'You are required to change your password.' }
    }
  }

  if (!id) {
    // if (!validator.isStrongPassword(input.password, strongPwOpts)) {
    //   return { error: 'Password must contain at least one uppercase, one lowercase, one number. Password min. length is 8 characters.' }
    // }

    if (input.password !== input.passwordConfirm) {
      return { error: 'Both password fields must match.' }
    }
  }

  if (id) {
    // if (input.newPassword && !validator.isStrongPassword(input.newPassword, strongPwOpts)) {
    //   return { error: 'Password must contain at least one uppercase, one lowercase, one number. Password min. length is 8 characters.' }
    // }

    if (input.newPassword !== input.newPasswordConfirm) {
      return { error: 'Both password fields must match.' }
    }
  }

  if (!customValidator.isName(input.name)) {
    return { error: 'Invalid name.' }
  }

  if (input.dateHired && !customValidator.isDate(input.birthday)) {
    return { error: 'birthday must be a valid date (Format: YYYY-MM-DD)' }
  }

  if (input.dateHired && !customValidator.isDate(input.dateHired)) {
    return { error: 'dateHired must be a valid date (Format: YYYY-MM-DD)' }
  }

  if (input.username === "") {
    return { error: 'Username is required.' }
  }

  if (input.email !== "" && !validator.isEmail(input.email)) {
    return { error: 'Invalid email address.' }
  }
  
  if (input.email !== "") {
    const emailExists = await Admin.findOne({ where: { email: input.email } })

    if (emailExists && emailExists.id !== id) {
      return { error: 'Another admin with the same email already exists.' }
    }
  }
  
  const usernameExists = await Admin.findOne({ where: { username: input.username } })

  if (usernameExists && usernameExists.id !== id) {
    return { error: 'Another admin with the same username already exists.' }
  }

  if (input.ipWhitelist && input.ipWhitelist.length > 30) {
    return { error: 'IP whitelist can only have a maximum of 30 entries.' }
  }

  if (input.ipWhitelist && !input.ipWhitelist.every(ip => validator.isIP(ip) === true ||
      validator.isIPRange(ip) === true)) {
    return { error: 'Invalid format for IP whitelist.' }
  }

  if (input.ipWhitelist.length !== new Set(input.ipWhitelist).size) {
    return { error: 'Duplicate IPs detected.' }
  }

  if (!store) {
    return { error: 'Store not found' }
  }

  if (input.role && !['super', 'admin', 'staff'].includes(input.role)) {
    return { error: 'Invalid role.' }
  }

  if (input.active && typeof (input.active) !== 'boolean') {
    return { error: 'Invalid admin active status.' }
  }

  if (input.baseSalary && !customValidator.isPrice(input.baseSalary)) {
    return { error: 'Invalid baseSalary value.' }
  }
  
  if (input.baseSSS && !customValidator.isPrice(input.baseSSS)) {
    return { error: 'Invalid baseSSS value.' }
  }

  if (input.basePagIbig && !customValidator.isPrice(input.basePagIbig)) {
    return { error: 'Invalid basePagIbig value.' }
  }

  if (input.basePhilhealth && !customValidator.isPrice(input.basePhilhealth)) {
    return { error: 'Invalid basePhilhealth value.' }
  }

  if (input.employerSSS && !customValidator.isPrice(input.employerSSS)) {
    return { error: 'Invalid employerSSS value.' }
  }

  if (input.employerPagIbig && !customValidator.isPrice(input.employerPagIbig)) {
    return { error: 'Invalid employerPagIbig value.' }
  }

  if (input.employerPhilhealth && !customValidator.isPrice(input.employerPhilhealth)) {
    return { error: 'Invalid employerPhilhealth value.' }
  }

  return true
}

module.exports = {
  adminValidate
}
