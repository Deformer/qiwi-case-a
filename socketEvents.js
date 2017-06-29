const socketioJwt = require('socketio-jwt');

const config = require('./config');
const messageService = require('./services/message');
const balanceService = require('./services/balance');

const openedConnections = [];

let confirmMessageAndUpdateBalance = (userId, message) => new Promise((resolve, reject) => {
  messageService.confirmMessage(userId, message.id).then((result) => {
    if (result[0] > 0) {
      balanceService.changeBalance(message.money, message.from, message.dialogId).then(() => {
        balanceService.changeBalance(-1 * message.money, message.to, message.dialogId).then(() => {
          resolve(true);
        })
      })
    } else {
        resolve(false);
    }
  });
});


// confirmMessageAndUpdateBalance(1,{
//   id: 4,
//   type: "cashe",
//   money: 100,
//   comment: "your mom",
//   isConfirmed: false,
//   from: 3,
//   to: 1,
//   dialogId: 36
// }).then(resp => {
//   console.log(resp);
//
// });

let answerOnMessage = function (socket, message, eventName) {
    let messageToSender = {
        messageId: message.id,
    };
    let messageToRecipient = {
        messageId: message.id,
    };
    balanceService.getBalance(message.from, message.dialogId).then((senderBalance) => {
        balanceService.getBalance(message.to, message.dialogId).then((recipientBalance) => {
            messageToSender.balance = senderBalance;
            messageToRecipient.balance = recipientBalance;
            socket.emit(eventName, messageToRecipient);
            if (openedConnections[message.from]) {
                openedConnections[message.from].emit(eventName, messageToSender);
            }
        })
    })
};

module.exports = {
    init: function (io) {
        io.sockets
          .on('connection', socketioJwt.authorize({
              secret: config.secret,
              timeout: 15000, // 15 seconds to send the authentication message
          }))
          .on('authenticated', (socket) => {
              openedConnections[socket.decoded_token.id] = socket;

              socket.on('disconnect', () => {
                  console.log(`User with id = ${socket.decoded_token.id} has been disconnected`);
                  delete openedConnections[socket.decoded_token.id];
              });

              socket.on('sendMessage', ({to, money, dialogId, comment, type}) => {
                  const userId = socket.decoded_token.id;
                  const message = {to, money, dialogId, comment, type};
                  message.from = userId;
                  console.log(message);
                  if (message.type === 'online') {
                      message.isConfirmed = true;
                      //Todo немножко нехорошо, потому что 2 запроса в БД подряд.
                      messageService.saveMessage(message).then((response) => {
                          balanceService.changeBalance(message.money, message.from, message.dialogId).then(() => {
                            balanceService.changeBalance(-1 * message.money, message.to, message.dialogId).then(() => {
                              let messageToSender = {
                                message: message,
                              };
                              let messageToRecipient = {
                                message: message,
                              };
                              balanceService.getBalance(message.from, message.dialogId).then((senderBalance) => {
                                balanceService.getBalance(message.to, message.dialogId).then((recipientBalance) => {
                                  messageToSender.balance = senderBalance;
                                  messageToRecipient.balance = recipientBalance;
                                  socket.emit('message', messageToRecipient);
                                  if (openedConnections[message.to]) {
                                    openedConnections[message.to].emit('message', messageToSender);
                                  }
                                })
                              })
                            })
                        })
                      });
                  } else if (message.type === 'cash') {
                      message.isConfirmed = false;
                      messageService.saveMessage(message).then((response) => {
                          socket.emit('message', response.dataValues);
                          if (openedConnections[message.to]) {
                              openedConnections[message.to].emit('message', response.dataValues);
                          }
                      })
                  }
              });
              socket.on('requestConfirmMessage', ({messageId, answer}) => {
                  const userId = socket.decoded_token.id;
                  console.log(`Get confirm request ${messageId}/${answer}`);
                  messageService.getById(messageId).then(message => {
                      if (message.to === socket.decoded_token.id) {
                          confirmMessageAndUpdateBalance(userId, message).then(response => {
                              if (response === true) {
                                  answerOnMessage(socket, message, 'responseConfirmMessage');
                              }
                          })
                      }
                      // else {
                      //     socket.emit('responseConfirmMessage', "Пшел нахуй");
                      //     if (openedConnections[message.from]) {
                      //         openedConnections[message.from].emit('responseConfirmMessage', "И ты тоже пшел нахуй");
                      //     }
                      // }
                  });
              })
          })
    }
};