const Message = require('../models/message');
const userService = require('./user');
const dialogService = require('./dialog');

module.exports = {
  saveMessage: messageObject => new Promise((resolve, reject) => {
    userService.checkIfUserExistWithId(messageObject.from).then((isFromExist) => {
      if (!isFromExist) { return resolve({ code: 404, message: 'from is not exist' }); }
      userService.checkIfUserExistWithId(messageObject.to).then((isToExist) => {
        if (!isToExist) { return resolve({ code: 404, message: 'to is not exist' }); }
        dialogService.checkIfDialogExistWithId(messageObject.dialogId).then((isDialogExist) => {
          if (!isDialogExist) { return resolve({ code: 404, message: 'dialog is not exist' }); }
          const message = Message.build(messageObject);
          message.save().then(() => {
            resolve({ code: 200 });
          });
        });
      });
    });
  }),
};
