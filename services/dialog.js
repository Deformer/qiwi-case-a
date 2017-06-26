const Dialog = require('../models/dialog');
const Message = require('../models/message');
const Balance = require('../models/balance');
const User = require('../models/user');

module.exports = {
  getAllDialogsToUser: (userId) => Dialog.findAll().then(dialogs => dialogs.map(d => d.toJSON())),
  createDialog: (members) => {
    const dialog = Dialog.build({
      members: members
    }, {
      include: [{
        model: User,
        as: 'members'
      }]
    });
    return dialog.save()
  }
};