const User = require('../models/user');
const smsService = require('./sms');

const UserService = {
  createNewUser: (phoneNumber, smsCode) => new Promise((resolve,reject) => {
    const newUser = new User({
      phoneNumber,
      smsCode
    });
    const savingResult = newUser.save();
    savingResult.then((user) => {
      smsService.sendSms(phoneNumber, smsCode).then(() => {
        resolve(user._id);
      }).catch(reject);
    }).catch(err => {
      reject()
    })
  }),
  confirmUserAccount: (userId, smsCode) => new Promise((resolve,reject) => {
    const seacrhingResult = User.findOne({_id: userId});
    seacrhingResult.then((user) => {
      //TODO check smsCode in future
      const updatingResult = User.update({_id: userId}, {isConfirmed: true});
      updatingResult.then(() => {
        resolve(user);
      })
        .catch(reject);
    })
  })
};

module.exports = UserService;