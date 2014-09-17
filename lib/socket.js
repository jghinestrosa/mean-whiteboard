'use strict';

module.exports = function(socket) {

  // Show a message in the server console
  // when a new user connects
  console.log('New user connected');

  // User disconnected
  socket.on('disconnect', function (data) {
    console.log('User disconnected');
  });

  // Received messages that are related to changes of the canvas
  socket.on('canvasData', function (data) {
    socket.broadcast.emit('canvasData', data);
  });

  // Received messages that are related to changes in layers
  socket.on('layersData', function (data) {
    console.log('layersData received');
    socket.broadcast.emit('layersData', data);
  });
};
