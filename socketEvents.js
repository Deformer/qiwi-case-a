const socketioJwt = require('socketio-jwt');

const config = require('./config');
const messageService = require('./services/message');
const balanceService = require('./services/balance');

const openedConnections = [];

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
                        messageService.saveMessage(message).then((response) => {
                            balanceService.changeBalance(message.money, message.from, message.dialogId).then(() => {
                                balanceService.changeBalance(-1 * message.money, message.to, message.dialogId).then((messageFromDb) => {
                                    balanceService.getBalance(message.from, message.dialogId);
                                    socket.emit('message', response.dataValues);
                                    if (openedConnections[message.to]) {
                                        openedConnections[message.to].emit('message', response.dataValues);
                                    }
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
                socket.on('requestConfirmMessage',
                    ({
                         messageId,
                         answer
                     }) => {
                        console.log(`Get confirm request ${messageId}/${answer}`);
                        messageService.getById(messageId).then(message => {
                            if (message.to === socket.decoded_token.id) {
                                messageService.confirmMessage(socket.decoded_token.id, messageId).then();
                                socket.emit('responseConfirmMessage', "Молодец");
                                if (openedConnections[message.from]) {
                                    openedConnections[message.from].emit('responseConfirmMessage', "И ты тоже молодец");
                                }
                            }
                            else {
                                socket.emit('responseConfirmMessage', "Пшел нахуй");
                                if (openedConnections[message.from]) {
                                    openedConnections[message.from].emit('responseConfirmMessage', "И ты тоже пшел нахуй");
                                }
                            }
                        });
                    });
            });
    }
};