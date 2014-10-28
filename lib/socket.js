'use strict';

var clientsSharing = [],
    clientsWaitingToShare = [];

module.exports = function(io) {

  return function(socket) {
    // Show a message in the server console
    // when a new user connects
    console.log('New user connected');
    console.log('Connected - ClientsSharing: ', clientsSharing);
    console.log('Connected - ClientsWaitingToShare: ', clientsWaitingToShare);

    // If there are users sharing already, ask for the state of the canvas
    if (clientsSharing.length > 0) {
      var clientId = clientsSharing[0];
      io.to(clientId).emit('initialStateRequest', {});
      clientsWaitingToShare.push(socket.id);
      console.log('ClientsSharing > 0 - ClientsSharing: ', clientsSharing);
      console.log('ClientsSharing > 0 - ClientsWaitingToShare: ', clientsWaitingToShare);
    }
    // If this user is the first one sharing, add him to the clients sharing list
    else {
      clientsSharing.push(socket.id);
      console.log('ClientsSharing <= 0 - ClientsSharing: ', clientsSharing);
      console.log('ClientsSharing <= 0 - ClientsWaitingToShare: ', clientsWaitingToShare);
    }

    socket.on('initialStateResponse', function(data) {
      if (clientsWaitingToShare.length > 0) {
        clientsWaitingToShare.forEach(function(socketId) {
          io.to(socketId).emit('initialStateData', data);
          clientsWaitingToShare.splice(clientsWaitingToShare.indexOf(socketId), 1);
          clientsSharing.push(socketId);
          console.log('initialStateResponse > 0 - ClientsSharing: ', clientsSharing);
          console.log('initialStateResponse > 0 - ClientsWaitingToShare: ', clientsWaitingToShare);
        });
      }
    });

    socket.on('initialStateData', function(data) {
      socket.emit('initialStateData', data);
    });



    // User disconnected
    socket.on('disconnect', function (data) {
      console.log('User disconnected');

      // Remove the user from the right list
      var index = clientsSharing.indexOf(socket.id);
      if (index !== -1) {
        clientsSharing.splice(index, 1);
      }
      else {
        index = clientsWaitingToShare.indexOf(socket.id);
        if (index !== -1) {
          clientsWaitingToShare.splice(index, 1);
        }
      }

      console.log('Disconnected - Clients Sharing', clientsSharing);
      console.log('Disconnected - Clients WaitingToShare', clientsWaitingToShare);
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

    // Received messages that store a new current state of the whiteboard
    socket.on('resetWhiteboard', function() {
      console.log('resetWhiteboard received');
      socket.broadcast.emit('resetWhiteboard');
    });
  };
};
