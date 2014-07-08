'use strict';

angular.module('meanWhiteboardApp')
  .directive('listenMouseEvents', function () {
    return {
      restrict: 'A',
      scope: {
        listenMouseEvents: '&'
      },
      link: function (scope, element, attrs) {
        var stopListeningMouseEvents = function() {
          element.off('mousedown mousemove mouseup');
        };

        var changeMouseEventHandlers = function(mode) {
          var name = mode.name;
          if (name === 'brush') {
            element.on('mousedown', function(e) {
              mode.handleMouseDown(e);

              // listen mouseMove events only when the mouse is pressed (dragging)
              element.on('mousemove', mode.handleMouseDrag);
            });

            element.on('mouseup', function() {
              element.off('mousemove');
            });
          }
          else if (name === 'eyedropper') {
            element.on('mousedown', function(e) {
              
              // it is needed to use $apply because the model is being changed and
              // another directive has to be notified to update the DOM
              scope.$apply(mode.handleMouseDown(e));
            });
          }
          else {
            
          }
        };

        // when the mode is changed, the handlers for the mouse events have to change too
       scope.$watch('listenMouseEvents()', function(newMode) {
        stopListeningMouseEvents();
        changeMouseEventHandlers(newMode);
       });

      }
    };
  });
