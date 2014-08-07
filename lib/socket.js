'use strict';

module.exports = function(socket) {
  //console.log('a new user connected');

  socket.on('message', function (data) {
    socket.broadcast.emit('message', data);
  });
};
