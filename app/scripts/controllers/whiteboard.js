'use strict';

angular.module('meanWhiteboardApp')
  .controller('WhiteboardCtrl', function ($scope, canvasFactory, buttonFactory) {

    /** canvasFactory **/
    // General properties
    $scope.properties = canvasFactory.properties;
    $scope.swapColors = canvasFactory.swapColors;

    // Layer management
    $scope.getLayers = canvasFactory.layers.getLayers;
    $scope.getNumberOfLayers = canvasFactory.layers.getNumberOfLayers;
    $scope.getLastLayerAdded = canvasFactory.layers.getLastLayerAdded;
    $scope.setContextToLayer = canvasFactory.layers.setContextToLayer;
    $scope.addNewLayer = canvasFactory.layers.addNewLayer;
    $scope.setOffsetToLayer = canvasFactory.layers.setOffsetToLayer;
    $scope.setSizeToLayer = canvasFactory.layers.setSizeToLayer;
    $scope.selectLayer = canvasFactory.layers.selectLayer;

    // Mouse events management for canvas
    $scope.handleMouseDown = function(event) {
      canvasFactory.canvasOperations.handleMouseDown(event);
    };

    $scope.handleMouseMove = function(event) {
      canvasFactory.canvasOperations.handleMouseMove(event);
    };

    $scope.handleMouseUp = function(event) {
      canvasFactory.canvasOperations.handleMouseUp(event);
    };

    // Mode
    $scope.setMode = canvasFactory.canvasOperations.setMode;
    $scope.getSelectedMode = canvasFactory.canvasOperations.getSelectedMode;

    /** Button Factory **/
    $scope.getButtons = buttonFactory.getButtons;

  });
