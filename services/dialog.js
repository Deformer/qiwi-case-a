const Dialog = require('../models/dialog');
const Message = require('../models/message');
const Balance = require('../models/balance');
const User = require('../models/user');

const dialogService = {
  findById: (id) => Dialog.findOne({where:{id}, include:[User, Balance, Message]}),
  getAllDialogsToUser: userId => Dialog.findAll(
    {
      include: [
        {
          model: User,
          where: {id: userId}
        },
        Message,
        {
          model: Balance,
          as: 'balances',
        },
      ],
    }).then(dialogs => dialogs),
  createDialog: (memberIds, avgBalance) => Promise.all(memberIds.map(
      id => User.findOne({ where: { id } }))).then((users) => {
        const balances = memberIds.map(id => ({
          money: avgBalance,
          userId: id,
        }));
        balances[0].money *= -1;
        return Dialog.create(
          {
            balances,
          },
          {
            include: [Balance, User],
          }).then(dialog => dialog.setUsers(users).then(() => dialogService.findById(dialog.id)));
      }),
  checkIfDialogExistWithId: id => Dialog.findOne({ where: { id } }).then(dialog => !!dialog),
};

module.exports = dialogService;
