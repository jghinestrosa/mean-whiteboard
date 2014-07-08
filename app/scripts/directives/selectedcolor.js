'use strict';

angular.module('meanWhiteboardApp')
  .directive('selectedColor', function () {
    return {
      restrict: 'A',
      scope: {
        color: '=selectedColor'
      },
      link: function (scope, element, attrs) {

        scope.$watch('color', function(value){
          element.css('background-color', scope.color);
        });

      }
    };
  });
