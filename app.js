const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const config = require('./config');
const connection = require('./models');
const router = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('superSecret', config.secret);

app.use('/', router);
const server = http.createServer(app);


const io = require('socket.io')(server);

const socket = require('./socketEvents.js');
socket.init(io);




connection.sync().then(() => {
    server.listen(config.port, () => {
        console.log(`server is listening on port ${config.port}`);
    });
});
