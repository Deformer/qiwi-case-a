const Balance = require('../models/balance');

module.exports = {
  changeBalance: (delta, userId, dialogId) => new Promise((resolve, reject) => {
    Balance.findOne({ where: { userId, dialogId } }).then((balance) => {
      Balance.update({ money: balance.money + delta }, { where: { userId, dialogId } })
        .then(resolve);
    });
  }),
}
;
