'use strict';

angular.module('meanWhiteboardApp')
  .factory('socketFactory', function() {
    //var socket = io.connect();
    var socket,
        disconnectedBefore = false,
        connected = false;

    var connect = function() {
      if (disconnectedBefore) {
        socket.io.reconnect();
      }
      else {
        socket = io.connect();
      }

      connected = true;
    };

    var disconnect = function() {
      socket.io.disconnect();
      disconnectedBefore = true;
      connected = false;
    };

    var isConnected = function() {
      return connected;
    };

    var on = function(name, callback, scope) {
      //socket.on(name, callback);
      socket.on(name, function() {
        var args = arguments;
        scope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    };

    var emit = function(name, data) {
      //socket.emit(name, data, callback);
      socket.emit(name, data, function() {
      
      });
    };

    return {
      connect: connect,
      disconnect: disconnect,
      isConnected: isConnected,
      on: on,
      emit: emit
    };
  });
