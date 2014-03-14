'use strict';

angular.module('meanWhiteboardApp')
  .controller('WhiteboardCtrl', function ($scope, canvasFactory) {
    
    $scope.properties = canvasFactory.properties;
    $scope.getLayers = canvasFactory.getLayers;
    $scope.getLastLayerAdded = canvasFactory.getLastLayerAdded;
    $scope.setContext = canvasFactory.setContext;
    $scope.addNewLayer = canvasFactory.addNewLayer;

    $scope.handleMouseDown = function(event) {
      console.log('mouseDown ' + event);
    };

    $scope.handleMouseMove = function(event) {
      console.log('mouseMove ' + event);
    };

    $scope.handleMouseOver = function(event) {
      console.log('mouseOver ' + event);
    };

    $scope.handleMouseUp = function(event) {
      console.log('mouseUp ' + event);
    };
  });
