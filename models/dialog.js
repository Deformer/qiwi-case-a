const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

// set up a mongoose model and pass it using module.exports
const dialogSchema = new Schema({
  balances: [{
    type: Number,
    default: 5000
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }]
});

dialogSchema.virtual('members', {
  ref: 'User',
  localField: '_id',
  foreignField: 'dialogs'
});

dialogSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'dialog'
});

module.exports = mongoose.model('Dialog', dialogSchema)