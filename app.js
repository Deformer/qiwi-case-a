const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketioJwt = require('socketio-jwt');

const config = require('./config');
const connection = require('./models');
const router = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('superSecret', config.secret);

app.use('/', router);
const server = http.createServer(app);

const openedConnections = {};

const io = require('socket.io')(server);

io.sockets
  .on('connection', socketioJwt.authorize({
    secret: config.secret,
    timeout: 15000, // 15 seconds to send the authentication message
  })).on('authenticated', (socket) => {
    openedConnections[socket.decoded_token.id] = socket;
    socket.on('disconnect', () => {
      console.log(`user with ${socket.decoded_token.id} disconnected`);
      delete openedConnections[socket.decoded_token.id];
    });

    socket.on('sendMessage', (
      ({
         to,
         money,
         dialogId,
         comment,
         type
      }) => {
        const { userId } = socket.decoded_token.id;
        const message = { to, money, dialogId, comment, type};
        message.from = userId;
        if(message.type === 'online'){
          message.isConfirmed = true;
          messageService.saveMessage(message).then((response) => {
            balanceService.changeBalance(message.money, message.from, message.dialogId).then(() => {
              balanceService.changeBalance(-1*message.money, message.to, message.dialogId).then((messageFromDb) => {
                socket.emit('message', messageFromDb)
                if (openedConnections[message.to]) {
                  openedConnections[message.to].emit('message', messageFromDb);
                }
              })
            })
          });
        } else if(message.type === 'cashe'){
          message.isConfirmed = false;
          messageService.saveMessage(message).then((messageFromDb) => {
            socket.emit('message', messageFromDb)
            if (openedConnections[message.to]) {
              openedConnections[message.to].emit('message', messageFromDb);
            }
          })
        }
    }));
  });


connection.sync().then(() => {
  server.listen(config.port, () => {
    console.log(`server is listening on port ${config.port}`);
  });
});
