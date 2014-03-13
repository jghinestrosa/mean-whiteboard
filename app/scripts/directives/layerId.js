'use strict';

angular.module('meanWhiteboardApp')
  .directive('layerId', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        // When layerId is loaded, the model is updated with the context of the canvas
        attrs.$observe('layerId', function(value){
          scope.setContext(value, element[0].getContext('2d'));
        });

      }
    };
  });
