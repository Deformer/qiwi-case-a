const Message = require('../models/message');
const userService = require('./user');
const dialogService = require('./dialog');
const Dialog = require('../models/dialog');

module.exports = {
    getById: (id) => Message.findOne({where: {id}}),
    saveMessage: messageObject => new Promise((resolve, reject) => {
        userService.checkIfUserExistWithId(messageObject.from).then((isFromExist) => {
            if (!isFromExist) {
                return resolve({code: 404, message: 'from is not exist'});
            }
            userService.checkIfUserExistWithId(messageObject.to).then((isToExist) => {
                if (!isToExist) {
                    return resolve({code: 404, message: 'to is not exist'});
                }
                dialogService.checkIfDialogExistWithId(messageObject.dialogId).then((isDialogExist) => {
                    if (!isDialogExist) {
                        return resolve({code: 404, message: 'dialog is not exist'});
                    }
                    const message = Message.build(messageObject);
                    message.save().then(() => {
                        Dialog.update({
                            updatedAt: new Date()
                          },
                          {
                            where:{id: messageObject.dialogId}
                          }
                        ).then(() => {
                          resolve(message);
                        })
                    });
                });
            });
        });
    }),
    confirmMessage: (userId, messageId) => Message.update({isConfirmed: true}, {
        where: {
            id: messageId,
            to: userId,
            isConfirmed: false
        }
    })
};
