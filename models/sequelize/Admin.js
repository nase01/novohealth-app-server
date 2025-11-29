'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate (models) {
      // define association here
      Admin.belongsTo(models.Branch, { as: 'branch' })
    }
  }
  Admin.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    dateHired: DataTypes.DATE,
    birthday: DataTypes.DATE,
    imageURL: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    pwResetToken: DataTypes.STRING,
    pwResetExpiry: DataTypes.DATE,
    pwForceChange: DataTypes.BOOLEAN,
    role: DataTypes.ENUM('super', 'admin', 'staff'),
    branchId: DataTypes.INTEGER,
    ipWhitelist: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    baseSalary: DataTypes.DOUBLE,
    baseSSS: DataTypes.DOUBLE,
    baseSSSNo: DataTypes.STRING,
    basePagIbig: DataTypes.DOUBLE,
    basePagIbigNo: DataTypes.STRING,
    basePhilhealth: DataTypes.DOUBLE,
    basePhilhealthNo: DataTypes.STRING,
    employerSSS: DataTypes.DOUBLE,
    employerPagIbig: DataTypes.DOUBLE,
    employerPhilhealth: DataTypes.DOUBLE,
  }, {
    sequelize,
    tableName: 'admins',
    version: true // Optimistic Locking
  })
  return Admin
}
