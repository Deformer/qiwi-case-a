const Dialog = require('../models/dialog');
const Message = require('../models/message');
const Balance = require('../models/balance');
const User = require('../models/user');

module.exports = {
  getAllDialogsToUser: (userId) => Dialog.findAll(
    {
      include:[{
        model: User,
        as: 'members'
      },
        Message,
        Balance
      ]
    }).then(dialogs => dialogs.map(d => d.toJSON())),
  createDialog: (memberIds) => {
    return Promise.all(memberIds.map(
      (id) => User.findOne({where:{id}})
      )).then(users => {
        const dialog = Dialog.build({});
        dialog.save().then(() => dialog.setMembers(users))
    })
  }
};