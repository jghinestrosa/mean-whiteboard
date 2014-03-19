'use strict';

angular.module('meanWhiteboardApp')
  .directive('swapColors', function () {
    return {
      restrict: 'A',
      scope: {
        swapColors: '&'
      },
      link: function (scope, element, attrs) {
        
        element.on('click', function() {
          scope.$apply(function(){
            scope.swapColors();
          });
        });
      }
    };
  });
