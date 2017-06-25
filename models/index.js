const { dbSettings } = require('../config');
const mongoose = require('mongoose');

module.exports = mongoose.connect(dbSettings.url, dbSettings.options);