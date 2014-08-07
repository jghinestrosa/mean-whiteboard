'use strict';

module.exports = function(socket) {

  socket.on('canvasData', function (data) {
    socket.broadcast.emit('canvasData', data);
  });
};
