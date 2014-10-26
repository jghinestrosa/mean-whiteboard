'use strict';

angular.module('meanWhiteboardApp')
  .directive('whiteboard', ['$window', function ($window) {
    return {
      templateUrl: 'templates/whiteboard.html',
      restrict: 'E',
      link: function(scope, element, attrs) {
      }
    };
  }]);
