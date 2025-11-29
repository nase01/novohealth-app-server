const bcrypt = require('bcrypt')
const { Admin, AdminLog } = require('../../models/sequelize')
const { EmailToken } = require('../../models/email/EmailToken.js')
const { Token } = require('../../models/Token.js')
const { sendmail } = require('../../utils/sendmail.js')
const { pwResetValidate } = require('../../utils/input-validate/pwResetValidate.js')
const { captcha } = require('../../utils/captcha.js')
const { userIp } = require('../../utils/userIp.js')

const passwordReset = async (req, res) => {
  try {
    const accountType = req.body.accountType

    const ip = userIp(req)

    const captchaResult = accountType === 'admin' ? true : await captcha(req.body.captchaToken, ip)
    if (!captchaResult) {
      return res.status(500).json({ errors: [{ status: '500', detail: 'Captcha verification failed.' }] })
    }

    const account = accountType === 'admin' ? await Admin.findOne({ where: { email: req.body.email } }) : null
    const validate = pwResetValidate(req.body, account)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    if (req.body.token) {
      account.password = await bcrypt.hash(req.body.newPassword, 12)
      account.pwResetToken = null
      account.pwResetExpiry = null

      await account.save()
      return res.status(200).json({ data: { success: true } })
    }

    const resetToken = new Token(3)

    account.pwResetToken = resetToken.token
    account.pwResetExpiry = resetToken.expiry

    await account.save()

    if (accountType === 'admin') {
      const adminLog = new AdminLog({
        activityInfo: 'Generated password reset token for own account.',
        adminId: account.id,
        username: account.username,
        ipAddress: ip
      })

      await adminLog.save()
    }

    const name = account.name

    const email = new EmailToken(name, account.email, resetToken.token, 'Password Reset', resetToken.expiresIn)

    const sendRes = await sendmail(email)

    if (!sendRes.success) {
      console.log("Mailer Response " + sendRes)
      return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
    }

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  passwordReset
}
