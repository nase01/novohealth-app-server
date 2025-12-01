'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    static associate (models) {
      // define association here
      Salary.belongsTo(models.Admin, { foreignKey: 'AdminId', as: 'admin' })
    }
  }
  Salary.init({
    adminId: DataTypes.INTEGER,
		branchId: DataTypes.INTEGER,
		payDate: DataTypes.DATE,
		payFrom: DataTypes.DATE,
		payTo: DataTypes.DATE,
		compBaseSalary: DataTypes.DOUBLE,
		compWorkDays: DataTypes.DOUBLE,
		compOvertime: DataTypes.DOUBLE,
		compHolidayPay: DataTypes.DOUBLE,
		compOthers: DataTypes.DOUBLE,
		totalPay: DataTypes.DOUBLE,
		dedLate: DataTypes.DOUBLE,
		dedUndertime: DataTypes.DOUBLE,
		dedAdvances: DataTypes.DOUBLE,
		dedLoans: DataTypes.DOUBLE,
		dedOthers: DataTypes.DOUBLE,
		govtSSS: DataTypes.DOUBLE,
		govtPhilhealth: DataTypes.DOUBLE,
		govtPagIbig: DataTypes.DOUBLE,
		govtWTax: DataTypes.DOUBLE,
		emprSSS: DataTypes.DOUBLE,
		emprPhilhealth: DataTypes.DOUBLE,
		emprPagIbig: DataTypes.DOUBLE,
		totalDeductions: DataTypes.DOUBLE,
		netPay: DataTypes.DOUBLE,
		remarks: DataTypes.STRING,
		createdBy: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'salary',
    version: true // Optimistic Locking
  })
  return Salary
}
