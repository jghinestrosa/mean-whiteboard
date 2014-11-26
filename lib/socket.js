'use strict';

// Manange connected clients
var clientsSharing = [],
    clientsWaitingToShare = [];

// Manage the rooms created
var rooms = {};
var clientsWaitingToShare2 = {};

module.exports = function(io) {

  return function(socket) {
    console.log('socketID:', socket.id);
    var roomId = '';

    // Show a message in the server console
    // when a new user connects
    /*console.log('New user connected');
    console.log('Connected - ClientsSharing: ', clientsSharing);
    console.log('Connected - ClientsWaitingToShare: ', clientsWaitingToShare);*/

    // If there are users sharing already, ask for the state of the canvas
    /*if (clientsSharing.length > 0) {
      var clientId = clientsSharing[0];
      io.to(clientId).emit('initialStateRequest', {});
      clientsWaitingToShare.push(socket.id);
      console.log('ClientsSharing > 0 - ClientsSharing: ', clientsSharing);
      console.log('ClientsSharing > 0 - ClientsWaitingToShare: ', clientsWaitingToShare);
    }*/
    // If this user is the first one sharing, add him to the clients sharing list
    /*else {
      clientsSharing.push(socket.id);
      console.log('ClientsSharing <= 0 - ClientsSharing: ', clientsSharing);
      console.log('ClientsSharing <= 0 - ClientsWaitingToShare: ', clientsWaitingToShare);
    }*/

    //socket.on('initialStateResponse', function(data) {
      //if (clientsWaitingToShare.length > 0) {
        //clientsWaitingToShare.forEach(function(socketId) {
          //io.to(socketId).emit('initialStateData', data);
          //clientsWaitingToShare.splice(clientsWaitingToShare.indexOf(socketId), 1);
          //clientsSharing.push(socketId);
          //console.log('initialStateResponse > 0 - ClientsSharing: ', clientsSharing);
          //console.log('initialStateResponse > 0 - ClientsWaitingToShare: ', clientsWaitingToShare);
        //});
      //}
    //});

    socket.on('initialStateData', function(data) {
      socket.emit('initialStateData', data);
    });

    socket.on('join', function(data) {
      data = JSON.parse(data);
      roomId = data.roomId;

      console.log('New user connected');
      console.log('Connected - ClientsSharing: ', clientsSharing);
      console.log('Connected - ClientsWaitingToShare: ', clientsWaitingToShare);

      // If the room does not exist, it is created
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      // If there are users sharing already, ask for the state of the canvas
      if (rooms[roomId].length > 0) {
        var clientId = rooms[roomId][0];
        io.to(clientId).emit('initialStateRequest', {});
        //clientsWaitingToShare.push(socket.id);

        // If the room does not exist, it is created
        if (!clientsWaitingToShare2[roomId]) {
          clientsWaitingToShare2[roomId] = [];
        }

        clientsWaitingToShare2[roomId].push(socket.id);

        // TODO: Check if this should be done when the initial state of the canvas has been shared first
        socket.join(roomId); 
        sendJoinedMessage();

        console.log('ClientsSharing in ' + roomId + '> 0 - ClientsSharing: ', rooms[roomId]);
        console.log('ClientsSharing in ' + roomId + '> 0 - ClientsWaitingToShare: ', clientsWaitingToShare2[roomId]);
      }
      // If this user is the first one sharing, add him to the clients sharing list
      else {
        rooms[roomId].push(socket.id);
        socket.join(roomId);
        sendJoinedMessage();

        console.log('ClientsSharing in ' + roomId + '<= 0 - ClientsSharing: ', rooms[roomId]);
        console.log('ClientsSharing in ' + roomId + '<= 0 - ClientsWaitingToShare: ', clientsWaitingToShare2[roomId]);
      }
    });

    socket.on('initialStateResponse', function(data) {
      if (clientsWaitingToShare2[roomId].length > 0) {
        clientsWaitingToShare2[roomId].forEach(function(socketId) {
          io.to(socketId).emit('initialStateData', data);
          clientsWaitingToShare2[roomId].splice(clientsWaitingToShare2[roomId].indexOf(socketId), 1);
          rooms[roomId].push(socketId);
          console.log('initialStateResponse > 0 - room ' + roomId + ': ', rooms[roomId]);
          console.log('initialStateResponse > 0 - ClientsWaitingToShare2[' + roomId + ']: ', clientsWaitingToShare2[roomId]);
        });
      }
    });


    // User disconnected
    socket.on('disconnect', function (data) {
      console.log('User disconnected');

      // Remove the user from the right list
      //var index = clientsSharing.indexOf(socket.id);
      //if (index !== -1) {
        //clientsSharing.splice(index, 1);
      //}
      //else {
        //index = clientsWaitingToShare.indexOf(socket.id);
        //if (index !== -1) {
          //clientsWaitingToShare.splice(index, 1);
        //}
      
      var index = -1;

      // If there are any users in the room
      if (rooms[roomId]) {
        index = rooms[roomId].indexOf(socket.id);
      }
      if (index !== -1) {
        rooms[roomId].splice(index, 1);
      }
      else {
        index = -1;

        if (clientsWaitingToShare2[roomId]) {
          index = clientsWaitingToShare2[roomId].indexOf(socket.id);
        }
        if (index !== -1) {
          clientsWaitingToShare2[roomId].splice(index, 1);
        }
      }

      console.log('Disconnected - Clients Sharing in ' + roomId, clientsSharing);
      console.log('Disconnected - Clients WaitingToShare in ' + roomId, clientsWaitingToShare);
    });

    // Received messages that are related to changes of the canvas
    socket.on('canvasData', function (data) {
      //socket.broadcast.emit('canvasData', data);
      //io.to(roomId).broadcast.emit('canvasData', data);
      socket.broadcast.to(roomId).emit('canvasData', data);
    });

    // Received messages that are related to changes in layers
    socket.on('layersData', function (data) {
      console.log('layersData received');
      //socket.broadcast.emit('layersData', data);
      io.to(roomId).broadcast.emit('layersData', data);
    });

    // Received messages that store a new current state of the whiteboard
    socket.on('resetWhiteboard', function() {
      console.log('resetWhiteboard received');
      //socket.broadcast.emit('resetWhiteboard');
      io.to(roomId).broadcast.emit('resetWhiteboard');
    });

    // Received messages for creating a new room
    socket.on('createNewRoom', function(data) {
      data = JSON.parse(data);
      var newRoomId = data.roomId;
      if (!rooms[newRoomId]) {
        console.log('New room id: ' + newRoomId);
        //rooms.push(newRoomId);
        rooms[newRoomId] = [];
        io.to(socket.id).emit('rooms', JSON.stringify(getRooms()));
      }
      else {
        io.to(socket.id).emit('roomAlreadyExists');
      }
    });

    // Received messages to get all the rooms
    socket.on('getAllRooms', function() {
      io.to(socket.id).emit('rooms', JSON.stringify(getRooms()));
      //socket.broadcast.to(socket.id).emit('rooms', JSON.stringify(rooms));
    });

    // Get roomId - number of participants
    function getRooms() {
      var roomsInfo = {};
      for (var room in rooms) {
        if (rooms.hasOwnProperty(room)) {
          roomsInfo[room] = rooms[room].length;
        }
      }

      return roomsInfo;
    }

    function sendJoinedMessage() {
      //console.log('ID: ', socket.id);
      io.to(socket.id).emit('joined');
    }

  };
};
