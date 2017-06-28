const connection = require('./index');
const Sequelize = require('sequelize');
const User = require('./user');

const Message = connection.define('message', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: Sequelize.STRING,
  },
  money: {
    type: Sequelize.FLOAT,
  },
  comment: {
    type: Sequelize.STRING,
  },
});

Message.belongsTo(User, { foreignKey: 'from' });
Message.belongsTo(User, { foreignKey: 'to' });

module.exports = Message;
