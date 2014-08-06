'use strict';

angular.module('meanWhiteboardApp')
  .controller('WhiteboardCtrl', function ($scope, canvasFactory, buttonFactory) {

    /** canvasFactory **/
    // General properties
    $scope.properties = canvasFactory.properties;
    $scope.setProperties = canvasFactory.setProperties;
    $scope.swapColors = canvasFactory.swapColors;

    // Layer management
    $scope.getLayers = canvasFactory.layers.getLayers;
    $scope.getNumberOfLayers = canvasFactory.layers.getNumberOfLayers;
    $scope.getLastLayerAdded = canvasFactory.layers.getLastLayerAdded;
    $scope.getSelectedLayer = canvasFactory.layers.getSelectedLayer;
    $scope.setCanvasToLayer = canvasFactory.layers.setCanvasToLayer;
    $scope.setContextToLayer = canvasFactory.layers.setContextToLayer;
    $scope.addNewLayer = canvasFactory.layers.addNewLayer;
    $scope.setOffsetToLayer = canvasFactory.layers.setOffsetToLayer;
    $scope.setSizeToLayer = canvasFactory.layers.setSizeToLayer;
    $scope.selectLayer = canvasFactory.layers.selectLayer;
    $scope.moveLayerUp = canvasFactory.layers.moveUp;
    $scope.moveLayerDown = canvasFactory.layers.moveDown;
    $scope.deleteSelectedLayer = canvasFactory.layers.deleteSelectedLayer;

    // History management
    $scope.addToHistory = canvasFactory.history.addToHistory;
    $scope.undo = canvasFactory.history.undo;
    $scope.redo = canvasFactory.history.redo;
    $scope.isHistoryEmpty = canvasFactory.history.isHistoryEmpty;

    // Show tools
    $scope.showBrushSize = function() {
      return $scope.getSelectedMode().name === 'brush';
    };

    $scope.showPencilSize = function() {
      return $scope.getSelectedMode().name === 'pencil';
    };

    // Mode

    $scope.mode = {};

    $scope.setMode = function(nameMode) {
      canvasFactory.canvasOperations.setMode(nameMode);
      var mode = canvasFactory.canvasOperations.getSelectedMode();
      $scope.mode.name = nameMode;
      $scope.mode.handleMouseDown = mode.handleMouseDown;
      $scope.mode.handleMouseDrag = mode.handleMouseDrag;
      $scope.mode.handleMouseMove = mode.handleMouseMove;
      $scope.mode.handleMouseUp = mode.handleMouseUp;
    };

    // Select mode by default
    $scope.setMode(canvasFactory.canvasOperations.getSelectedMode().name);

    $scope.getSelectedMode = canvasFactory.canvasOperations.getSelectedMode;




    /** Button Factory **/
    $scope.getButtons = buttonFactory.getButtons;

    // Color Selector setttings
    $scope.colorSelector = {};
    $scope.colorSelector.visible = false;
    $scope.colorSelector.selectedColor = $scope.properties.foregroundColor;
    $scope.colorSelector.isForegroundColor = '';

    // Show or hide the color selector
    $scope.colorSelector.toggleVisibility = function(value) {
      $scope.colorSelector.visible = value;
    };

    // Function to select a color using the color selector
    $scope.colorSelector.selectColor = function(selectedColor) {
      $scope.colorSelector.selectedColor = selectedColor;
      if ($scope.colorSelector.isForegroundColor) {
        //$scope.properties.foregroundColor = selectedColor;
        $scope.setProperties({foregroundColor:selectedColor});
      }
      else {
        //$scope.properties.backgroundColor = selectedColor;
        $scope.setProperties({backgroundColor:selectedColor});
      }
    };

    // Function to show the color selector
    $scope.colorSelector.show = function(selectedColor, isForegroundColor) {
      $scope.colorSelector.isForegroundColor = isForegroundColor;
      $scope.colorSelector.selectColor(selectedColor);
      $scope.colorSelector.toggleVisibility(true);
    };

  });
