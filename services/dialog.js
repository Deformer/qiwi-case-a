const Dialog = require('../models/dialog');
const Message = require('../models/message');
const Balance = require('../models/balance');
const User = require('../models/user');

module.exports = {
  getAllDialogsToUser: (userId) => Dialog.findAll(
    {
      where:{'"dialogMembers".userId': userId},
      include:[
      {
        model: User,
        as: User.tableName
      },
        Message,
      {
        model:Balance,
        as: 'balances'
      }
      ]
    }).then(dialogs => dialogs.map(d => d.toJSON())),
  createDialog: (memberIds) => {
    return Promise.all(memberIds.map(
      (id) => User.findOne({where:{id}})
      )).then(users => {
        const dialog = Dialog.build({balances: memberIds.map(id => (
          {
            money:0,
            userId: id
          },
            {
              includes:[{model:Balance, as: 'balances'}]
            }
          ))});
        dialog.save().then(() => dialog.setMembers(users))
    })
  },
  checkIfDialogExistWithId: (id) => Dialog.findOne({where:{id}}).then(dialog => !!dialog)
};