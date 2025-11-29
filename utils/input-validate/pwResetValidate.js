const dayjs = require('dayjs')
const validator = require('validator')
const { strongPwOpts } = require('../strongPwOpts.js')

const pwResetValidate = (input, account) => {
  if (!account) {
    return { error: 'Account does not exist.' }
  }

  if (!input.email || !validator.isEmail(input.email)) {
    return { error: 'Invalid email address.' }
  }

  if (input.token) {
    if (account.pwResetToken !== input.token || dayjs().isAfter(account.pwResetExpiry)) {
      return { error: 'Invalid or expired reset token.' }
    }

    if (!validator.isStrongPassword(input.newPassword, strongPwOpts)) {
      return { error: 'Password must contain at least one uppercase, one lowercase, one number. Password min. length is 8 characters.' }
    }

    if (input.newPassword !== input.newPasswordConfirm) {
      return { error: 'Both password fields must match.' }
    }
  }

  return true
}

module.exports = {
  pwResetValidate
}
