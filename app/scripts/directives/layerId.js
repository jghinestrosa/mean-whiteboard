'use strict';

angular.module('meanWhiteboardApp')
  .directive('layerId', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        element[0].width = element[0].offsetWidth;
        element[0].height = element[0].offsetHeight;

        // When layerId is loaded, the model is updated with the context of the canvas
        attrs.$observe('layerId', function(id) {
          scope.setContextToLayer(id, element[0].getContext('2d'));
          scope.setOffsetToLayer(id, element[0].offsetLeft, element[0].offsetTop);
        });

      }
    };
  });
