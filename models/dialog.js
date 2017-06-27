const connection = require('./index');
const Sequelize = require('sequelize');
const User = require('./user');
const Balance = require('./balance');
const Message = require('./message');

const Dialog = connection.define('dialog', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }
});

Dialog.belongsToMany(User, {through: 'dialogMembers'});
Dialog.hasMany(Balance, {as: 'balances', foreignKey: 'dialogId'});
Dialog.hasMany(Message, {foreignKey: 'dialogId'});

module.exports = Dialog;