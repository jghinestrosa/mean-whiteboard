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
          var canvas = element[0],
              context = element[0].getContext('2d');

          scope.setCanvasToLayer(id, canvas);
          scope.setContextToLayer(id, context);
          scope.setOffsetToLayer(id, canvas.offsetLeft, canvas.offsetTop);
          scope.setSizeToLayer(id, canvas.offsetWidth, canvas.offsetHeight);

          // If this layer has been created using the data received
          // from a remote user, draw the canvas content
          var layer = scope.getLayer(id);
          if (layer.initialDataURL) {
            var img = new Image();
            img.src = layer.initialDataURL;
            img.onload = function(e) {
              context.clearRect(0, 0, layer.width, layer.height);
              //context.drawImage(img, 0, 0, layer.width, layer.height);
              context.drawImage(img, 0, 0, e.target.width, e.target.height);
            };
          }

          // If this canvas element is the selected layer, add its initial state as the first
          // snapshot of the history
          if (scope.getSelectedLayer().id === parseInt(id, 10)) {
            //if (scope.isHistoryEmpty()) {
              scope.addToHistory({
                dataURL: canvas.toDataURL('img/png'),
                layer: scope.getSelectedLayer(),
                isANewLayer: true
            });
            //}
          }
        });

      }
    };
  });
