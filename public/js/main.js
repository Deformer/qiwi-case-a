/**
 * Created by sergey on 27.06.17.
 */
var socket = io.connect('http://localhost:5838');

const jwt1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmVOdW1iZXIiOiI4OTIxNzQ1Njc4NyIsImlhdCI6MTQ5ODUwMjA0Nn0.IjbFxDIYGvBmYvyh29nGHmAwUZhs9_HCQf4nogiQIYA"

socket.on('connect', function () {
  socket
    .emit('authenticate', {token: jwt1}) //send the jwt
    .on('authenticated', function () {
      socket.emit('sendMessage',{id:22, message:"hello im 1"});;
    })
    .on('message', (resp) => {
      console.log(resp.message)
    })
    .on('unauthorized', function(msg) {
      console.log("unauthorized: " + JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    })
});