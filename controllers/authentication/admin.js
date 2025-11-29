const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Admin, AdminLog } = require('../../models/sequelize')
const config = require('../../config')
const { userIp, userIpCheck } = require('../../utils/userIp.js')
const { Op } = require('sequelize');

const authAdmin = async (req, res, next) => {
  try {
    const ip = userIp(req)
    const userAgent = req.headers['user-agent']

    const username = req.body.username || null;

    const admin = await Admin.findOne({
      where: {
        [Op.or]: [
          { email: username },
          { username: username }
        ]
      }
    });
    
    if (!admin) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Incorrect username/password.' }] })
    }

    const correctPass = await bcrypt.compare(req.body.password, admin.password)

    if (!correctPass) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Incorrect username/password.' }] })
    }

    if (!userIpCheck(req, admin)) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized IP address.' }] })
    }

    if (!admin.active) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Account disabled.' }] })
    }

    const token = jwt.sign({
      id: admin.id,
      name: admin.name,
      accountType: 'admin',
      username: admin.username,
      email: admin.email,
      role: admin.role,
      branchId: admin.branchId,
      active: admin.active,
      imageURL: admin.imageURL,
      ip,
      userAgent
    },
    config.jwt.secret,
    { expiresIn: config.jwt.duration }
    )

    const adminLog = new AdminLog({
      activityInfo: `${admin.name} logged in.`,
      adminId: admin.id,
      username: admin.username,
      ipAddress: ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true, 
      user: { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role,
        token 
      } 
    }})
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: 'Internal Server Error'
    })
  }
}

const authCurrentAdmin = (req, res) => {
  try {
    const ip = userIp(req)
    const admin = req.currentAdmin

    return res.status(200)
      .json({
        data: {
          currentAdmin: {
            ip,
            id: admin.id,
            name: admin.name,
            accountType: 'admin',
            username: admin.username,
            email: admin.email,
            role: admin.role,
            branchId: admin.branchId,
            active: admin.active,
            imageURL: admin.imageURL,
            pwForceChange: admin.pwForceChange,
            ipWhitelist: admin.ipWhitelist,
            baseSalary: admin.baseSalary,
            baseSSS: admin.baseSSS,
            basePagIbig: admin.basePagIbig,
            basePhilhealth: admin.basePhilhealth
          }
        }
      })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

const signOutAdmin = async (req, res) => {
  const ip = userIp(req);

  try {
    const token = req.headers['authorization'].replace(/^Bearer\s+/, '');

    if (!token) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'No token provided.' }] });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ errors: [{ status: '401', detail: 'Invalid token.' }] });
      }

      
      // Optional: Add token blacklisting
      const adminLog = new AdminLog({
        activityInfo: `${decoded.name} logged out.`,
        adminId: decoded.id,
        username: decoded.username,
        ipAddress: ip
      })

      adminLog.save()
      
      return res.status(200).json({ data: { success: true, message: 'Signed out' } });
      
    });
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] });
  }
}

module.exports = {
  authAdmin,
  authCurrentAdmin,
  signOutAdmin
}
