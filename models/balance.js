const connection = require('./index');
const Sequelize = require('sequelize');

const Balance = connection.define('balance', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  money: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
});


module.exports = Balance;
