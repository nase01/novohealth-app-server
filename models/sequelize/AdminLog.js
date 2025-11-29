'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class AdminLog extends Model {
    static associate (models) {
      // define association here
      AdminLog.belongsTo(models.Admin, { as: 'admin' })
    }
  }
  AdminLog.init({
    adminId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    activityInfo: DataTypes.STRING,
    ipAddress: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'adminLogs',
    version: true // Optimistic Locking
  })
  return AdminLog
}
