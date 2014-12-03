'use strict';

angular.module('meanWhiteboardApp')
  .controller('WhiteboardCtrl', function ($scope, $location, canvasFactory, buttonFactory, socketFactory, uploadPictureFactory) {

    // Info for socket io messages
    var LAYERS_DATA = 'layersData',
        CANVAS_DATA = 'canvasData',
        INITIAL_STATE_REQUEST = 'initialStateRequest',
        INITIAL_STATE_RESPONSE = 'initialStateResponse',
        INITIAL_STATE_DATA = 'initialStateData',
        RESET_WHITEBOARD = 'resetWhiteboard',
        GET_ALL_ROOMS = 'getAllRooms',
        ROOMS = 'rooms',
        CREATE_NEW_ROOM  = 'createNewRoom',
        JOIN_ROOM = 'join',
        JOINED = 'joined',
        CHAT_MESSAGE = 'chatMessage';

    /** canvasFactory **/
    // General properties
    $scope.properties = canvasFactory.properties;
    $scope.setProperties = canvasFactory.setProperties;
    $scope.swapColors = canvasFactory.swapColors;

    // Layer management
    $scope.getLayer = canvasFactory.layers.getLayer;
    $scope.getLayers = canvasFactory.layers.getLayers;
    $scope.getNumberOfLayers = canvasFactory.layers.getNumberOfLayers;
    $scope.getLastLayerAdded = canvasFactory.layers.getLastLayerAdded;
    $scope.getSelectedLayer = canvasFactory.layers.getSelectedLayer;
    $scope.setCanvasToLayer = canvasFactory.layers.setCanvasToLayer;
    $scope.setContextToLayer = canvasFactory.layers.setContextToLayer;
    $scope.setOffsetToLayer = canvasFactory.layers.setOffsetToLayer;
    $scope.setSizeToLayer = canvasFactory.layers.setSizeToLayer;
    $scope.selectLayer = canvasFactory.layers.selectLayer;

    // History management
    $scope.isHistoryEmpty = canvasFactory.history.isHistoryEmpty;

    // Filters
    $scope.filters = canvasFactory.filters;
    $scope.filtersVisible = false;
    $scope.filterSelected = $scope.filters[0];

    $scope.applyFilter = function() {
      var canvas = canvasFactory.layers.getSelectedLayer().canvas;
      $scope.filterSelected.filter(canvas, canvas.width, canvas.height);
    };

    $scope.setFiltersVisible = function(visible) {
      $scope.filtersVisible = visible;
    };

    // Show tools
    $scope.showBrushSize = function() {
      return $scope.getSelectedMode().name === 'brush';
    };

    $scope.showPencilSize = function() {
      return $scope.getSelectedMode().name === 'pencil';
    };

    // Upload picture
    $scope.uploadPicture = function() {
      var whiteboardAsImage = getWhiteboardAsImage();
      uploadPictureFactory.setPictureToUpload(whiteboardAsImage);
      $location.url('/uploadPicture');
    };

    // Paint tools
    $scope.paintToolsVisible = false;

    $scope.togglePaintTools = function() {
      $scope.paintToolsVisible = !$scope.paintToolsVisible;
    };

    $scope.setPaintToolsVisible = function(visible) {
      $scope.paintToolsVisible = visible;
    };

    // New whiteboard
    $scope.resetWhiteboard = function() {
      canvasFactory.resetState();

      if (socketFactory.isConnected()) {
        sendMessageToServer(RESET_WHITEBOARD);
      }
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
        handleMouseDown: function(x, y) {
          var selectedLayer = $scope.getSelectedLayer();

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
            sendMessageToServer(CANVAS_DATA, canvasData);
          }

          // Update points after sending the data to the remote
          // client because points are updated by reference
          mode.updatePoints();

        },

        handleMouseDrag: function(x, y) {
          var selectedLayer = $scope.getSelectedLayer();
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
            sendMessageToServer(CANVAS_DATA, canvasData);
          }

          // Update points after sending the data to the remote
          // client because points are updated by reference
          mode.updatePoints();
        },

        handleMouseUp: function() {
          var selectedLayer = $scope.getSelectedLayer();
          $scope.addToHistory({
            dataURL: selectedLayer.canvas.toDataURL('img/png'),
            layer: selectedLayer,
            isANewLayer: false
          });
        }

      };
    };
    
    // Handlers for pencil mode and eraser pencil mode
    modes.getPencilMode = function(nameMode) {
      var mode = canvasFactory.canvasOperations.getMode(nameMode);

      return {
        handleMouseDown: function(x, y) {
          var selectedLayer = $scope.getSelectedLayer();
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

          if (socketFactory.isConnected()) {
            // Send the data to the rest of the clients
            var canvasData = {
              nameMode: mode.name,
              execute: 'press',
              settings: settings
            };
            sendMessageToServer(CANVAS_DATA, canvasData);
          }

        },

        handleMouseDrag: function(x, y) {
          var selectedLayer = $scope.getSelectedLayer();
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

          if (socketFactory.isConnected()) {
            // Send data to the rest of clients using the socket
            var canvasData = {
              nameMode: mode.name,
              execute: 'draw',
              settings: settings
            };
            sendMessageToServer(CANVAS_DATA, canvasData);
          }
        },

        handleMouseUp: function() {
          var selectedLayer = $scope.getSelectedLayer();
          $scope.addToHistory({
            dataURL: selectedLayer.canvas.toDataURL('img/png'),
            layer: selectedLayer,
            isANewLayer: false
          });
        }

      };
    };

    // Handlers for pencil mode and eraser pencil mode
    modes.getEyedropperMode = function(nameMode) {
      var mode = canvasFactory.canvasOperations.getMode(nameMode);

      return {
        handleMouseDown: function(x, y) {
          var selectedLayer = $scope.getSelectedLayer();
          var settings = {
            layerId: selectedLayer.id,
            x: x,
            y: y
          };
          mode.press(settings);
        }
      };
    };

    $scope.setMode = function(nameMode) {
      canvasFactory.canvasOperations.setMode(nameMode);

      var mode;
      if (nameMode === 'brush' || nameMode === 'eraserBrush') {
        mode = modes.getBrushMode(nameMode);
        $scope.mode = {
          name: nameMode,
          handleMouseDown: mode.handleMouseDown,
          handleMouseDrag: mode.handleMouseDrag,
          handleMouseUp: mode.handleMouseUp
        };
      }
      else if (nameMode === 'pencil' || nameMode === 'eraserPencil') {
        mode = modes.getPencilMode(nameMode);
        $scope.mode = {
          name: nameMode,
          handleMouseDown: mode.handleMouseDown,
          handleMouseDrag: mode.handleMouseDrag,
          handleMouseUp: mode.handleMouseUp
        };
      }
      else if (nameMode === 'eyedropper') {
        mode = modes.getEyedropperMode(nameMode);
        $scope.mode = {
          name: nameMode,
          handleMouseDown: mode.handleMouseDown,
        };
      }
    };

    // Select mode by default
    $scope.setMode(canvasFactory.canvasOperations.getSelectedMode().name);

    $scope.getSelectedMode = canvasFactory.canvasOperations.getSelectedMode;

    // Rooms available
    $scope.rooms = {};

    // The name of a new room
    $scope.newRoomName = '';

    // Selected room
    $scope.selectedRoom = '';

    var roomSelectorVisible = false; 

    // Chat messages
    $scope.chatMessages = {
      lastSent: '',
      lastReceived: ''
    };

    // Send a message to the server using a socket
    var sendMessageToServer = function(name, data) {
      if (data) {
        data = JSON.stringify(data);
      }
      socketFactory.emit(name, data);
    };

    $scope.connect = function() {
      socketFactory.connect();

      if (socketFactory.hasBeenConnectedBefore()) {
        return;
      }

      socketFactory.on('connect', function() {
        console.log('CONNECTED');

        // Clear history when begin to share the whiteboard
        canvasFactory.history.clearHistory();

        socketFactory.setConnectedBefore(true);

        /** Messages received from other clients through the server using a socket **/
        socketFactory.on(CANVAS_DATA, function(data) {
          data = JSON.parse(data);
          var mode = canvasFactory.canvasOperations.getMode(data.nameMode);

          // Execute the function
          mode[data.execute](data.settings);
        }, $scope);

        socketFactory.on(LAYERS_DATA, function(data) {
          data = JSON.parse(data);

          // Execute the function
          canvasFactory.layers[data.execute](data.params);
        }, $scope);

        // If a new user is connected, an INITIAL_STATE_REQUEST will be received
        // and the current state of the whiteboard is send to the remote users
        // in order to synchronize
        socketFactory.on(INITIAL_STATE_REQUEST, function() {
          var initialState = canvasFactory.getState();
          sendMessageToServer(INITIAL_STATE_RESPONSE, initialState);
        }, $scope);

        socketFactory.on(INITIAL_STATE_DATA, function(data) {
          data = JSON.parse(data);
          canvasFactory.setInitialState(data);
        }, $scope);

        // Reset the whiteboard
        socketFactory.on(RESET_WHITEBOARD, function() {
          canvasFactory.resetState();
        }, $scope);

        // Rooms available
        socketFactory.on(ROOMS, function(rooms) {
          $scope.rooms = JSON.parse(rooms);
        }, $scope);

        // Joined to a room correctly
        socketFactory.on(JOINED, function() {
          $scope.showRoomSelector(false);
        }, $scope);

        // Chat message received
        socketFactory.on(CHAT_MESSAGE, function(message) {
          $scope.chatMessages.lastReceived = message;
        }, $scope);

        // Request all rooms available and show the room selector
        sendMessageToServer(GET_ALL_ROOMS);
        $scope.showRoomSelector(true);

      }, $scope);

    };

    $scope.sendChatMessage = function() {
      sendMessageToServer(CHAT_MESSAGE, {msg: $scope.chatMessages.lastSent});
    };

    $scope.clearLastChatMessageSent = function() {
      $scope.chatMessages.lastSent = '';
    };

    $scope.showRoomSelector = function(value) {
      roomSelectorVisible = value;
    };

    $scope.isRoomSelectorVisible = function() {
      return roomSelectorVisible;
    };

    $scope.selectRoom = function(roomId) {
      $scope.selectedRoom = roomId;
    };

    $scope.isRoomSelected = function(roomId) {
      return $scope.selectedRoom === roomId;
    };

    // Create a new room for sharing canvas
    $scope.createNewRoom = function() {
      if ($scope.newRoomName !== '') {
        sendMessageToServer(CREATE_NEW_ROOM, {roomId: $scope.newRoomName});
        $scope.newRoomName = '';
      }
    };

    $scope.joinRoom = function() {
      if ($scope.selectedRoom !== '' && $scope.nickname !== '') {
        sendMessageToServer(JOIN_ROOM, {nickname: $scope.nickname, roomId: $scope.selectedRoom});
        $scope.selectedRoom = '';
      }
    };

    $scope.disconnect = function() {
      socketFactory.disconnect();

      if ($scope.isRoomSelectorVisible()) {
        $scope.showRoomSelector(false);
      }

    };

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

      // Return the new layer created
      return canvasFactory.layers.getLayer(id);
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

    //$scope.deleteSelectedLayer = canvasFactory.layers.deleteSelectedLayer;
    $scope.deleteSelectedLayer = function() {
      // Delete the selected layer in local canvas
      var selectedLayer = canvasFactory.layers.getSelectedLayer();
      canvasFactory.layers.deleteSelectedLayer(selectedLayer.id);

      // Delete the selected layer in remote canvas
      if (socketFactory.isConnected()) {
        var layersData = {
          execute: 'deleteSelectedLayer',
          params: selectedLayer.id
        };
        sendMessageToServer(LAYERS_DATA, layersData);
      }
    };

    /** History Management **/
    // Disable the history if the whiteboard is being shared
    $scope.addToHistory = function(snapshot) {
      if (!socketFactory.isConnected()) {
        canvasFactory.history.addToHistory(snapshot);
      }
    };

    $scope.undo = function() {
      if (!socketFactory.isConnected()) {
        return canvasFactory.history.undo();
      }
    };

    $scope.redo = function() {
      if (!socketFactory.isConnected()) {
        return canvasFactory.history.redo();
      }
    };

    /** Save whiteboard as image **/
    $scope.imageSaved = '#';
    $scope.showImageSaved = false;

    // TODO: Add this to canvasFactory? Make this a $scope method?
    var getWhiteboardAsImage = function() {
     var finalCanvas = document.createElement('canvas');
      var ctx = finalCanvas.getContext('2d');
      var layers = canvasFactory.layers.getLayers(false);
      finalCanvas.width = layers[0].width;
      finalCanvas.height = layers[0].height;

      layers.forEach(function(layer) {
        ctx.drawImage(layer.canvas, 0, 0, finalCanvas.width, finalCanvas.height);
      });

      return finalCanvas.toDataURL('img/png');
    };

    $scope.saveAsImage = function() {
      $scope.imageSaved = getWhiteboardAsImage();
      $scope.showImageSaved = true;
    };

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
