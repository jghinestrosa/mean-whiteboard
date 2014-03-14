'use strict';

angular.module('meanWhiteboardApp')
  .directive('listenMouseEvents', function () {
    return {
      restrict: 'A',
      scope: {
        handlerMouseDown: '&',
        handlerMouseMove: '&',
        handlerMouseUp: '&'
      },
      link: function (scope, element, attrs) {
        element.on('mousedown', function(e) {
          scope.handlerMouseDown({event: e});

          // Listen mouseMove events just when the mouse is down
          element.on('mousemove', function(e) {
            scope.handlerMouseMove({event: e});
          });
        });

        element.on('mouseup', function(e) {
          scope.handlerMouseUp({event: e});
          element.off('mousemove');
        });
      }
    };
  });
