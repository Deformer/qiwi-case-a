const { dbSettings } = require('../config');
const Sequelize = require('sequelize');

module.exports = new Sequelize(...Object.values(dbSettings));
