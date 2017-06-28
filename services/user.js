const User = require('../models/user');
const smsService = require('./sms');

const UserService = {
  createNewUser: (phoneNumber, smsCode) => new Promise((resolve, reject) => {
    const newUser = User.build({
      phoneNumber,
      smsCode,
    });
    newUser.save().then(() => {
      smsService.sendSms(phoneNumber, smsCode).then(() => {
        resolve(newUser.id);
      }).catch(reject);
    }).catch((err) => {
      reject();
    });
  }),
  confirmUserAccount: (userId, smsCode) => new Promise((resolve, reject) => {
    User.findOne({ where: { id: userId } }).then((user) => {
      // TODO check smsCode in future
      if (user) {
        User.update({ isConfirmed: true }, { where: { id: userId } }).then(() => {
          const { id, phoneNumber } = user.toJSON();
          resolve({ id, phoneNumber });
        }).catch(reject);
      }
    }).catch(reject);
  }),
  getUserWithPhoneNumber: phoneNumber => User.findOne({ where: { phoneNumber } }).then(user => user),
  checkIfUserExistWithId: id => User.findOne({ where: { id } }).then(user => !!user),
};

module.exports = UserService;
