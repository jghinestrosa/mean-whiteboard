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
    $scope.getSelectedLayer = canvasFactory.layers.getSelectedLayer;
    $scope.setContextToLayer = canvasFactory.layers.setContextToLayer;
    $scope.addNewLayer = canvasFactory.layers.addNewLayer;
    $scope.setOffsetToLayer = canvasFactory.layers.setOffsetToLayer;
    $scope.setSizeToLayer = canvasFactory.layers.setSizeToLayer;
    $scope.selectLayer = canvasFactory.layers.selectLayer;
    $scope.moveLayerUp = canvasFactory.layers.moveUp;
    $scope.moveLayerDown = canvasFactory.layers.moveDown;

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

    // Color Selector setttings
    $scope.colorSelector = {};
    $scope.colorSelector.visible = false;
    $scope.colorSelector.selectedColor = $scope.properties.foregroundColor;
    $scope.colorSelector.isForegroundColor = '';

    $scope.colorSelector.toggleVisibility = function(value) {
      $scope.colorSelector.visible = value;
    };

    $scope.colorSelector.selectColor = function(selectedColor) {
      $scope.colorSelector.selectedColor = selectedColor;
      if ($scope.colorSelector.isForegroundColor) {
        $scope.properties.foregroundColor = selectedColor;
      }
      else {
        $scope.properties.backgroundColor = selectedColor;
      }
    };

    $scope.colorSelector.show = function(selectedColor, isForegroundColor) {
      $scope.colorSelector.isForegroundColor = isForegroundColor;
      $scope.colorSelector.selectColor(selectedColor);
      $scope.colorSelector.toggleVisibility(true);
    };

  });
