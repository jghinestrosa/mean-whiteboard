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
          element.off('mousedown mousemove mouseup touchstart touchmove touchend');
        };

        // For brush, eraser and pencil modes
        var changeToSomeDrawingMode = function(mode) {

          /** Touch Events **/
          element.on('touchstart', function(e) {
            // Don't fire mousedown event
            e.preventDefault();

            // X and Y minus whiteboard div offset, minus the border width of the whiteboard div
            var x = e.originalEvent.targetTouches[0].clientX - e.currentTarget.offsetLeft - element[0].clientLeft;
            var y = e.originalEvent.targetTouches[0].clientY - e.currentTarget.offsetTop - element[0].clientTop;
            mode.handleMouseDown(x, y);
          });

          element.on('touchmove', function(e) {
            // Prevent scrolling while painting
            e.preventDefault();

            var x = e.originalEvent.targetTouches[0].clientX - e.currentTarget.offsetLeft - element[0].clientLeft;
            var y = e.originalEvent.targetTouches[0].clientY - e.currentTarget.offsetTop - element[0].clientTop;
            mode.handleMouseDrag(x, y);
          });

          element.on('touchend', function() {
            console.log('touchend');
            mode.handleMouseUp();
          });

          /** Mouse Events **/
          element.on('mousedown', function(e) {
            console.log('mousedown');
            var x = e.originalEvent.layerX;
            var y = e.originalEvent.layerY;
            mode.handleMouseDown(x, y);

            //listen mouseMove events only when the mouse is pressed (dragging)
            element.on('mousemove', function(e) {
              var x = e.originalEvent.layerX;
              var y = e.originalEvent.layerY;
              mode.handleMouseDrag(x, y);
            });
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
