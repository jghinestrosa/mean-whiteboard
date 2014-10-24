'use strict';

angular.module('meanWhiteboardApp')
  .directive('whiteboard', ['$window', function ($window) {
    return {
      templateUrl: 'templates/whiteboard.html',
      restrict: 'E',
      link: function(scope, element, attrs) {
        var whiteboard = angular.element('#whiteboard');
        var whiteboardBackground = angular.element('#whiteboard-background');
        var windowSize =  {width: $window.innerWidth, height: $window.innerHeight};

        whiteboard.css(windowSize);
        whiteboardBackground.css(windowSize);
        
      }
    };
  }]);
