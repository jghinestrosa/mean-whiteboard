'use strict';

angular.module('meanWhiteboardApp')
  .directive('dropFile', ['socketFactory', function (socketFactory) {
    return {
      restrict: 'A',
      //scope: {
        //callback: '&dropFile'
      //},
      link: function postLink(scope, element, attrs) {

        element.on('dragover', function(e) {
          e.stopPropagation();
          e.preventDefault();
        });
        
        //element.on('drop', scope.dropFileHandler);
        
        element.on('drop', function(e) {
          e = e.originalEvent || e;

          e.stopPropagation();
          e.preventDefault();

          // Load an image using drag and drop only if the whiteboard
          // is not being shared
          if (!socketFactory.isConnected()) {
            var files = e.dataTransfer.files;

            // TODO: Check that the loaded file is an image file

            var fileReader = new FileReader();
            fileReader.onload = function(evt) {
              scope.$apply(function() {
                var dataURL = evt.target.result;

                // Add a new layer and set the image as its initialDataURL
                var newLayer = scope.addNewLayer();
                newLayer.initialDataURL = dataURL;
              });
            };
            fileReader.readAsDataURL(files[0]);
          }
        });
      }
    };
  }]);
