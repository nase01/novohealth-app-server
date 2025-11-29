'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        trim: true,
        required: true
      },
      address: {
        type: Sequelize.STRING,
        trim: true,
        required: true
      },
      dateHired: {
        type: Sequelize.DATE,
        required: true
      },
      birthday: {
        type: Sequelize.DATE,
        required: true
      },
      imageURL: {
        type: Sequelize.STRING,
        trim: true,
        required: true
      },
      email: {
        type: Sequelize.STRING,
        unique: false,
        trim: true,
        isEmail: true,
        lowercase: true,
        required: false
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        trim: true,
        required: true
      },
      password: {
        type: Sequelize.STRING,
        required: true
      },
      pwResetToken: {
        type: Sequelize.STRING,
        required: false
      },
      pwResetExpiry: {
        type: Sequelize.DATE,
        required: false
      },
      pwForceChange: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      role: {
        type: Sequelize.ENUM('super', 'admin', 'staff'),
        required: true
      },
      branchId: {
        type: Sequelize.INTEGER,
        required: true,
        defaultValue: 0
      },
      ipWhitelist: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },
      baseSalary: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      baseSSS: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      baseSSSNo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      basePagIbig: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      basePagIbigNo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      basePhilhealth: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      basePhilhealthNo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      employerSSS: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      employerPagIbig: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      employerPhilhealth: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      version: { // Optimistic Locking
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('admins')
  }
}
