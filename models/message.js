const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
const messageSchema = new Schema({
  from:{
    type: ObjectId,
    ref: 'User'
  },
  to: {
    type: ObjectId,

  }

});

messageSchema.virtual('dialogs', {
  ref: 'Dialog',
  localField: '_id',
  foreignField: 'members'
});

messageSchema.pre('save', function (next) {
  if(!this.name)
    this.name = this.get('phoneNumber');
  next();
});

module.exports = mongoose.model('User', messageSchema)