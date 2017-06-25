const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
const userSchema = new Schema({
  phoneNumber: {
    type: String,
    unique : true,
    required : true
  },
  name: {
    type: String,
    default: this.phoneNumber
  },
  balance: {
    type: Number,
    default: 5000
  },
  smsCode: {
    type: Number
  },
  qiwiToken: {
    type: String,
    required: false
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  dialogs: [{
    type: ObjectId,
    ref: 'Dialog'
  }]
});

userSchema.virtual('dialogs', {
  ref: 'Dialog',
  localField: '_id',
  foreignField: 'members'
});

userSchema.pre('save', function (next) {
  if(!this.name)
    this.name = this.get('phoneNumber');
  next();
});

module.exports = mongoose.model('User', userSchema)