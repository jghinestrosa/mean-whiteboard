'use strict';

angular.module('meanWhiteboardApp')
  .controller('WhiteboardCtrl', function ($scope, canvasFactory) {
    
    // General properties
    $scope.properties = canvasFactory.properties;

    // Layer management
    $scope.getLayers = canvasFactory.layers.getLayers;
    $scope.getNumberOfLayers = canvasFactory.layers.getNumberOfLayers;
    $scope.getLastLayerAdded = canvasFactory.layers.getLastLayerAdded;
    $scope.setContextToLayer = canvasFactory.layers.setContextToLayer;
    $scope.addNewLayer = canvasFactory.layers.addNewLayer;
    $scope.setOffsetToLayer = canvasFactory.layers.setOffsetToLayer;
    $scope.selectLayer = canvasFactory.layers.selectLayer;

    // Mouse events management for canvas
    $scope.handleMouseDown = function(event){
      canvasFactory.canvasOperations.handleMouseDown(event);
    };

    $scope.handleMouseMove = function(event){
      canvasFactory.canvasOperations.handleMouseMove(event);
    };

    $scope.handleMouseUp = function(event) {
      canvasFactory.canvasOperations.handleMouseUp(event);
    };

    // Mode
    $scope.setMode = canvasFactory.canvasOperations.setMode;

  });
