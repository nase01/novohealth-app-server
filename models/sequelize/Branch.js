'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate (models) {
      // define association here
    }
  }
  Branch.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'branches',
    version: true // Optimistic Locking
  })
  return Branch
}
