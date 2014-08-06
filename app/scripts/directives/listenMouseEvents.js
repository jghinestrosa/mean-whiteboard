'use strict';

angular.module('meanWhiteboardApp')
  .directive('listenMouseEvents', function () {
    return {
      restrict: 'A',
      scope: {
        mode: '=listenMouseEvents'
      },
      link: function (scope, element, attrs) {
        var stopListeningMouseEvents = function() {
          element.off('mousedown mousemove mouseup');
        };

        // For brush, eraser and pencil modes
        var changeToSomeDrawingMode = function(mode) {
            element.on('mousedown', function(e) {
              mode.handleMouseDown(e);

              // listen mouseMove events only when the mouse is pressed (dragging)
              element.on('mousemove', mode.handleMouseDrag);
            });

            element.on('mouseup', function() {
              element.off('mousemove');
              mode.handleMouseUp();
            });
        };

        // For eyedropper mode
        var changeToEyedropperMode = function(mode) {
            element.on('mousedown', function(e) {
              
              // it is needed to use $apply because the model is being changed and
              // another directive has to be notified to update the DOM
              scope.$apply(mode.handleMouseDown(e));
            });
        };

        var changeMouseEventHandlers = function(mode) {
          var name = mode.name;
          if (name === 'brush') {
            changeToSomeDrawingMode(mode);
          }
          else if (name === 'eyedropper') {
            changeToEyedropperMode(mode);
          }
          else if (name === 'eraserBrush') {
            // the handlers are the same than brushMode, only the globalCompositeOperation of the mode is different
            changeToSomeDrawingMode(mode);
          }
          else if (name === 'pencil') {
            // the handlers are different but
            changeToSomeDrawingMode(mode);
          }
        };

        // when the mode changes, the handlers for the mouse events have to change too
       scope.$watch('mode', function(newMode) {
        stopListeningMouseEvents();
        changeMouseEventHandlers(newMode);
       });

      }
    };
  });
