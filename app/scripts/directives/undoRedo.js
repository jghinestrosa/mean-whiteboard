'use strict';

angular.module('meanWhiteboardApp')
  .directive('undoRedo', function () {
    return {
      restrict: 'A',
      scope: {
        handler: '&undoRedo'
      },
      link: function postLink(scope, element, attrs) {
        element.on('click', function() {
          var snapshot = scope.handler();

          if (!snapshot) {
            return;
          }

          var layer = snapshot.layer;
          var img = new Image();
          img.src = snapshot.dataURL;
          img.onload = function() {
            //console.log('img loaded');
            layer.ctx.clearRect(0, 0, layer.width, layer.height);
            layer.ctx.drawImage(img, 0, 0, layer.width, layer.height);
          };
        });
      }
    };
  });
