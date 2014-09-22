'use strict';

angular.module('meanWhiteboardApp')
  .controller('WhiteboardCtrl', function ($scope, canvasFactory, buttonFactory, socketFactory) {

    // Info for socket io messages
    var LAYERS_DATA = 'layersData',
        CANVAS_DATA = 'canvasData';

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
    //$scope.addNewLayer = canvasFactory.layers.addNewLayer;
    $scope.setOffsetToLayer = canvasFactory.layers.setOffsetToLayer;
    $scope.setSizeToLayer = canvasFactory.layers.setSizeToLayer;
    $scope.selectLayer = canvasFactory.layers.selectLayer;
    //$scope.moveLayerUp = canvasFactory.layers.moveUp;
    //$scope.moveLayerDown = canvasFactory.layers.moveDown;
    //$scope.deleteSelectedLayer = canvasFactory.layers.deleteSelectedLayer;

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

    // Object to store different handlers for mouse events
    // depending on the mode
    var modes = {};

    // Handlers for brush mode and eraser brush mode
    modes.getBrushMode = function(nameMode) {
      var mode = canvasFactory.canvasOperations.getMode(nameMode);

      return {
        handleMouseDown: function(e) {

          if (e.originalEvent) {
            e = e.originalEvent;
          }

          var selectedLayer = $scope.getSelectedLayer();

          var x = e.layerX - selectedLayer.offsetLeft;
          var y = e.layerY - selectedLayer.offsetTop;
          mode.initializePoints(x, y);
          var points = mode.calculateMidPoint(x, y);
          var settings = {
            layerId: selectedLayer.id,
            brushSize: canvasFactory.properties.brushSize,
            color: canvasFactory.properties.foregroundColor,
            brushCap: canvasFactory.properties.brushCap,
            globalCompositeOperation: mode.globalCompositeOperation,
            oldPoint: points.oldPoint,
            currentPoint: points.currentPoint,
            currentMidPoint: points.currentMidPoint,
            oldMidPoint: points.oldMidPoint,
          };
          mode.press(settings);

          if (socketFactory.isConnected()) {
            // Send the data to the rest of the clients
            var canvasData = {
              nameMode: mode.name,
              execute: 'press',
              settings: settings
            };
            sendMessageToServer('canvasData', canvasData);
          }

          // Update points after sending the data to the remote
          // client because points are updated by reference
          mode.updatePoints();

        },

        handleMouseDrag: function(e) {
          if (e.originalEvent) {
            e = e.originalEvent;
          }

          var selectedLayer = $scope.getSelectedLayer();
          var x = e.layerX - selectedLayer.offsetLeft;
          var y = e.layerY - selectedLayer.offsetTop;
          var points = mode.calculateMidPoint(x, y);

          var settings = {
            layerId: selectedLayer.id,
            brushSize: canvasFactory.properties.brushSize,
            color: canvasFactory.properties.foregroundColor,
            brushCap: canvasFactory.properties.brushCap,
            globalCompositeOperation: canvasFactory.properties.globalCompositeOperation,
            oldPoint: points.oldPoint,
            currentPoint: points.currentPoint,
            currentMidPoint: points.currentMidPoint,
            oldMidPoint: points.oldMidPoint,
          };

          // Draw locally
          mode.draw(settings);

          if (socketFactory.isConnected()) {
            // Send data to the rest of clients using the socket
            var canvasData = {
              nameMode: mode.name,
              execute: 'draw',
              settings: settings
            };
            sendMessageToServer('canvasData', canvasData);
          }

          // Update points after sending the data to the remote
          // client because points are updated by reference
          mode.updatePoints();
        },

        handleMouseUp: function() {

        }

      };

    };
    
    // Handlers for pencil mode and eraser pencil mode
    modes.getPencilMode = function(nameMode) {
      var mode = canvasFactory.canvasOperations.getMode(nameMode);

      return {
        handleMouseDown: function(e) {

          if (e.originalEvent) {
            e = e.originalEvent;
          }

          var selectedLayer = $scope.getSelectedLayer();

          var x = e.layerX - selectedLayer.offsetLeft;
          var y = e.layerY - selectedLayer.offsetTop;
          var settings = {
            layerId: selectedLayer.id,
            pencilSize: canvasFactory.properties.pencilSize,
            color: canvasFactory.properties.foregroundColor,
            pencilCap: canvasFactory.properties.pencilCap,
            globalCompositeOperation: mode.globalCompositeOperation,
            x: x,
            y: y
          };
          mode.press(settings);

          // Send the data to the rest of the clients
          var canvasData = {
            nameMode: mode.name,
            execute: 'press',
            settings: settings
          };
          sendMessageToServer('canvasData', canvasData);

        },

        handleMouseDrag: function(e) {
          if (e.originalEvent) {
            e = e.originalEvent;
          }

          var selectedLayer = $scope.getSelectedLayer();
          var x = e.layerX - selectedLayer.offsetLeft;
          var y = e.layerY - selectedLayer.offsetTop;
          var settings = {
            layerId: selectedLayer.id,
            pencilSize: canvasFactory.properties.pencilSize,
            color: canvasFactory.properties.foregroundColor,
            pencilCap: canvasFactory.properties.pencilCap,
            globalCompositeOperation: mode.globalCompositeOperation,
            x: x,
            y: y
          };

          // Draw locally
          mode.draw(settings);

          // Send data to the rest of clients using the socket
          var canvasData = {
            nameMode: mode.name,
            execute: 'draw',
            settings: settings
          };
          sendMessageToServer('canvasData', canvasData);
        },

        handleMouseUp: function() {

        }

      };

    };

    $scope.setMode = function(nameMode) {
      canvasFactory.canvasOperations.setMode(nameMode);
      $scope.mode.name = nameMode;

      var mode;
      if (nameMode === 'brush' || nameMode === 'eraserBrush') {
        mode = modes.getBrushMode(nameMode);
        $scope.mode.handleMouseDown = mode.handleMouseDown; 
        $scope.mode.handleMouseDrag = mode.handleMouseDrag; 
        $scope.mode.handleMouseUp = mode.handleMouseUp; 
      }
      else if (nameMode === 'pencil' || nameMode === 'eraserPencil') {
        mode = modes.getPencilMode(nameMode);
        $scope.mode.handleMouseDown = mode.handleMouseDown; 
        $scope.mode.handleMouseDrag = mode.handleMouseDrag; 
        $scope.mode.handleMouseUp = mode.handleMouseUp; 
      }


    };

    // Select mode by default
    $scope.setMode(canvasFactory.canvasOperations.getSelectedMode().name);

    $scope.getSelectedMode = canvasFactory.canvasOperations.getSelectedMode;

    // Send a message to the server using a socket
    var sendMessageToServer = function(name, data) {
      socketFactory.emit(name, JSON.stringify(data));
    };

    $scope.connect = function() {
      socketFactory.connect();

      /** Messages received from other clients through the server using a socket **/
      socketFactory.on('canvasData', function(data) {
        data = JSON.parse(data);
        var mode = canvasFactory.canvasOperations.getMode(data.nameMode);

        // Execute the function
        mode[data.execute](data.settings);
      }, $scope);

      socketFactory.on(LAYERS_DATA, function(data) {
        data = JSON.parse(data);
        console.log('layersData received');
        console.dir(data);

        // Execute the function
        canvasFactory.layers[data.execute](data.params);
      }, $scope);
    };

    $scope.disconnect = socketFactory.disconnect;

    // Function used for show or not the share canvas button
    $scope.isSharingCanvas = function() {
      return socketFactory.isConnected();
    };

    /** Layers Management **/
    $scope.addNewLayer = function() {
      // Add a new layer in local and select it
      var id = canvasFactory.layers.addNewLayer();
      canvasFactory.layers.selectLayer(id);

      // Add a new layer in remote canvas but not selecting it
      if (socketFactory.isConnected()) {
        var layersData = {
          execute: 'addNewLayer'
        };

        sendMessageToServer(LAYERS_DATA, layersData);
      }
    };

    $scope.moveLayerUp = function() {
      // Move up the selected layer in local canvas
      var selectedLayer = canvasFactory.layers.getSelectedLayer();
      canvasFactory.layers.moveUp(selectedLayer.id);

      // Move up the selected layer in remote canvas
      if (socketFactory.isConnected()) {
        var layersData = {
          execute: 'moveUp',
          params: selectedLayer.id
        };
        sendMessageToServer(LAYERS_DATA, layersData);
      }
    };

    $scope.moveLayerDown = function() {
      // Move down the selected layer in local canvas
      var selectedLayer = canvasFactory.layers.getSelectedLayer();
      canvasFactory.layers.moveDown(selectedLayer.id);

      // Move up the selected layer in remote canvas
      if (socketFactory.isConnected()) {
        var layersData = {
          execute: 'moveDown',
          params: selectedLayer.id
        };
        sendMessageToServer(LAYERS_DATA, layersData);
      }
    };
    $scope.deleteSelectedLayer = canvasFactory.layers.deleteSelectedLayer;


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
