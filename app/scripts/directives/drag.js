'use strict';

angular.module('meanWhiteboardApp')
  .directive('drag', ['$document', function ($document) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var startX = 0,
            startY = 0,
            x = 0,
            y = 0,
            position;

        element.on('mousedown', function(e) {
          e.preventDefault();
          position = {top: parseInt(element.css('top'), 10), left: parseInt(element.css('left'), 10)};
          startX = e.pageX;
          startY = e.pageY;

          $document.on('mousemove', function(e) {
            x = e.pageX - startX;
            y = e.pageY - startY;

            element.css({
              top: (position.top + y) + 'px',
              left: (position.left + x) + 'px',
            });

            console.log(element.css('left'), element.css('top'));
          
          });

          $document.on('mouseup', function() {
            $document.off('mousemove');
            $document.off('mouseup');
          });

        });
      }
    };
  }]);
