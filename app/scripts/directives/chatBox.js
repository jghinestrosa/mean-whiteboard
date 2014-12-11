'use strict';

angular.module('meanWhiteboardApp')
  .directive('chatBox', function () {
    return {
      templateUrl: 'templates/chatBox.html',
      restrict: 'E',
      scope: true,
      replace: true,
      link: function postLink(scope, element, attrs) {

        // The list of chat messages
        var messagesList = angular.element('#chat-messages');

        // Send a message to the rest of users and add it to the list of messages
        scope.sendMessage = function() {
          addMessageToList(scope.chatMessages.lastSent);
          scope.sendChatMessage();
          scope.clearLastChatMessageSent();
        };

        // Watch if a new message is received from another user and add it to the list
        scope.$watch('chatMessages.lastReceived', function(val) {
          if (val !== '') {
            addMessageToList(val);
          }
        });

        // Add a new message to the list of messages
        function addMessageToList(msg) {
          //var messagesList = angular.element('#' + listId);
          messagesList.append(angular.element('<li>').text(msg));
          messagesList[0].scrollTop = messagesList[0].scrollHeight;
        }
      }
    };
  });
