const connection = require('./index');
const Sequelize = require('sequelize');
const Balance = require('./balance');

const User = connection.define('user', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue() {
      return this.phoneNumber;
    },
  },
  isConfirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

User.hasMany(Balance, { foreignKey: 'userId' });

module.exports = User;
