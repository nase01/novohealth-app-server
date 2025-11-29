'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    require('dotenv/config')
    const bcrypt = require('bcrypt')

    const hashedPassword = await bcrypt.hash(process.env.SEED_FA_PASSWORD, 12)

    await queryInterface.bulkInsert('admins', [{
      name: process.env.SEED_FA_NAME,
      email: process.env.SEED_FA_EMAIL,
      username: process.env.SEED_FA_USERNAME,
      password: hashedPassword,
      ipWhitelist: '',
      role: 'super',
      active: true,
      pwForceChange: false,
      branchId: 1, // HQ Store Branch
      createdAt: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', null, {})
  }
}
