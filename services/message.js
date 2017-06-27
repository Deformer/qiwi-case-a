const Message = require('../models/message');
const userService = require('./user');
const dialogService = require('./dialog');

module.exports = {
  saveMessage: (dialogId, messageObject) => {
    userService.checkIfUserExistWithId(messageObject.from).then(isFromExist => {
      if(!isFromExist)
        return Promise.resolve({code: 404, message: "from is not exist"});
      userService.checkIfUserExistWithId(messageObject.to).then(isToExist => {
        if(!isToExist)
          return Promise.resolve({code: 404, message: "to is not exist"});
        dialogService.checkIfDialogExistWithId(message.dialogId).then( isDialogExist => {
          if(!isDialogExist)
            return Promise.resolve({code: 404, message: "dialog is not exist"});
          const message = Message.build(messageObject);
          return message.save()
        });
      })
    });
  }
};