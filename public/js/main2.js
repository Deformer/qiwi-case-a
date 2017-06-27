/**
 * Created by sergey on 27.06.17.
 */
var socket = io.connect('http://localhost:5838');

const jwt22 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsInBob25lTnVtYmVyIjoiODkxMzc0NTY3ODciLCJpYXQiOjE0OTg1Nzg2NzF9.OrMMxtCMdJ4ek3SvL6_rK9-_aZuF8UaCBK9kvvqGlDI"

socket.on('connect', function () {
  socket
    .emit('authenticate', {token: jwt22}) //send the jwt
    .on('authenticated', function () {
      socket.emit('sendMessage',{id:1, message:"hello im 22"});
    })
    .on('message', (resp) => {
      console.log(resp.message)
    })

    .on('unauthorized', function(msg) {
      console.log("unauthorized: " + JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    })
});/**
 * Created by sergey on 27.06.17.
 */
