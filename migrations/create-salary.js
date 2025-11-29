'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('salary', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      adminId: {
        type: Sequelize.INTEGER
      },
      branchId: {
        type: Sequelize.INTEGER
      },
			payDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
			payFrom: {
        allowNull: false,
        type: Sequelize.DATE
      },
			payTo: {
        allowNull: false,
        type: Sequelize.DATE
      },
			compBaseSalary: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      compWorkDays: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			compOvertime: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			compHolidayPay: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			compOthers: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			totalPay: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			dedLate: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			dedUndertime: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      dedAdvances: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      dedLoans: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      dedOthers: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			govtSSS: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			govtPhilhealth: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			govtPagIbig: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },

      emprSSS: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      emprPhilhealth: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
      emprPagIbig: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			totalDeductions: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			netPay: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0.00
      },
			remarks: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ""
      },
      version: { // Optimistic Locking
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdBy: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('salary')
  }
}
