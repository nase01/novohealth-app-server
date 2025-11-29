'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class AdminDeleted extends Model {
    static associate (models) {
      // define association here
    }
  }
  AdminDeleted.init({
    adminId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'adminDeleted',
    version: true // Optimistic Locking
  })
  return AdminDeleted
}
