'use strict';

angular.module('meanWhiteboardApp')
  .factory('socketFactory', function() {
    var socket = io.connect();

    var on = function(name, callback) {
      socket.on(name, callback);
    };

    var emit = function(name, data) {
      //socket.emit(name, data, callback);
      socket.emit(name, data, function() {
      
      });
    };

    return {
      on: on,
      emit: emit
    };
  });
