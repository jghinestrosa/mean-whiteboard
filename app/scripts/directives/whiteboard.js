'use strict';

angular.module('meanWhiteboardApp')
  .directive('whiteboard', function () {
    return {
      templateUrl: 'templates/whiteboard.html',
      restrict: 'E',
      link: function(scope, element, attrs) {

      }
    };
  });
