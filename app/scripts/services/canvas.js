'use strict';

angular.module('meanWhiteboardApp')
  .factory('canvasFactory', ['colorConversionFactory', 'localStorageFactory', function(colorConversion, localStorage) {

    // General properties by default
    var defaultProperties = {
      brushSize: 30,
      brushCap: 'round',
      eraserWidth: 5,
      eraserCap: 'round',
      pencilSize: 10,
      pencilCap: 'square',
      foregroundColor: '#00FF00',
      backgroundColor: '#ffffff',
      width: 500,
      height: 500,
    };

    // General properties
    var properties = (function() {
      var savedProperties = localStorage.get('properties');

      // Restore the last session properties
      if (savedProperties) {
        return savedProperties;
      }

      return defaultProperties;
    
    }());

    // Set new values for the general properties and
    // store them in the localStorage
    var setProperties = function(updatedProperties) {
      updatedProperties = updatedProperties || {};

      for (var prop in updatedProperties) {
        if (updatedProperties.hasOwnProperty(prop)) {
          properties[prop] = updatedProperties[prop];
        }
      }

      // Save the new properties in localStorage
      localStorage.save({
        key:'properties',
        val: properties
      });

    };

    // Swap the foreground and background colors and
    // store the general properties in the localStorage
    var swapColors = function() {
      var oldForegroundColor = properties.foregroundColor;
      properties.foregroundColor = properties.backgroundColor;
      properties.backgroundColor = oldForegroundColor;

      // Save the new properties in localStorage
      localStorage.save({
        key:'properties',
        val: properties
      });

    };

    /** State of the whiteboard manager **/

    // Set a specified initial state
    var setInitialState = function(state) {
      // Reset layers info
      numberOfLayers = 0;
      layersArray = [];
      layersMap = {};
      selectedLayer = {};

      // Delete the ng-repeat angular remote info
      state.layersArray.forEach(function(layer) {
        if (layer.$$hashKey) {
          delete layer.$$hashKey;
        }
      });

      // Load layers settings
      layersArray = state.layersArray;

      // Keep the layers objects references in the map
      layersArray.forEach(function(layer) {
        layersMap[layer.id] = layer;
      });

      numberOfLayers = state.numberOfLayers;
      nextLayerId = state.nextLayerId;
      layers.selectLayer(state.selectedLayerId);
    };

    // Get current state
    var getState = function() {
      var state = {};

      // Layers data
      state.layersArray = [];
      layersArray.forEach(function(layer) {
        var copiedLayer = new Layer(layer.id);
        
        // Canvas data
        copiedLayer.initialDataURL = layers.toDataURL(layer.id);
        state.layersArray.push(copiedLayer);
      });

      state.numberOfLayers = numberOfLayers;
      state.nextLayerId = layers.getLastLayerId();
      state.selectedLayerId = selectedLayer.id;

      return state;
    };

    /** Layers configuration **/

    var layersMap = {},
        layersArray = [],
        nextLayerId = 0,
        numberOfLayers = 0,
        selectedLayer;

    var getNextLayerId = function() {
      return nextLayerId++;
    };

    // Layer constructor
    var Layer = function(id) {
      this.id = id;
      this.globalCompositeOperation = 'source-over';
      this.globalAlpha = 1.0;
      this.isSelected = false;
    };

    /** API for layers **/
    var layers = {

      addNewLayer:  function(id) {
        // create and select a new layer
        if (id === undefined) {
          id = getNextLayerId();
        }
        //id = id || getNextLayerId();
        var newLayer = new Layer(id);

        // the new layer is added to the map and the array
        layersMap[id] = newLayer;
        layersArray.push(newLayer);

        numberOfLayers++;

        return id;
      },

      getLastLayerId: function() {
        return nextLayerId;
      },

      getLayer: function(id) {
        return layersMap[id];
      },

      getLayers: function(reversed) {
        if (reversed) {
          return layersArray.slice().reverse();
        }

        return layersArray;
      },

      getNumberOfLayers: function() {
        return numberOfLayers;
      },

      getSelectedLayer: function() {
        return selectedLayer;
      },

      // Select active context
      selectLayer: function(id) {
        // if there was already a selected layer, unselect it first
        if (selectedLayer) {
          selectedLayer.isSelected = false;
        }

        layersMap[id].isSelected = true;
        selectedLayer = layersMap[id];
      },

      // Set canvas elment to a layer
      setCanvasToLayer: function(id, canvas) {
        layersMap[id].canvas = canvas;
      },

      // Set context 2d to a layer
      setContextToLayer: function(id, ctx) {
        layersMap[id].ctx = ctx;
      },

      // Set offset of canvas to layer
      setOffsetToLayer: function(id, offsetLeft, offsetTop) {
        layersMap[id].offsetLeft = offsetLeft;
        layersMap[id].offsetTop = offsetTop;
      },
      
      // Set offset of canvas to layer
      setSizeToLayer: function(id, width, height) {
        layersMap[id].width = width;
        layersMap[id].height = height;
      },

      toDataURL: function(id) {
        return layersMap[id].canvas.toDataURL('img/png');
      },

      moveUp: function(id) {
        var layer = layersMap[id];
        for (var i = 0; i < layersArray.length; i++) {
          if (layersArray[i].id === layer.id) {
            if (i !== 0) {
              var previousLayer = layersArray[i-1];
              layersArray[i-1] = layer;
              layersArray[i] = previousLayer;
              break;
            }
          }
        }
      },

      moveDown: function(id) {
        var layer = layersMap[id];
        for (var i = 0; i < layersArray.length; i++) {
          if (layersArray[i].id === layer.id) {
            if (i !== layersArray.length-1) {
              var nextLayer = layersArray[i+1];
              layersArray[i+1] = layer;
              layersArray[i] = nextLayer;
              break;
            }
          }
        }
      },

      deleteSelectedLayer: function(id) {
        if (numberOfLayers !== 1) {
          var layer = layersMap[id];
          var index = layersArray.indexOf(layer);
          var idNewLayerSelected;

          if (index !== -1) {
            var idLayerSelected = layer.id;

            // if the layer is in the last position, select the previous layer
            if (index === layersArray.length-1) {
              idNewLayerSelected = layersArray[index-1].id;
            }

            // if not, select the next layer
            else {
              idNewLayerSelected = layersArray[index+1].id;
            }

            // delete all history related to the layer
            history.deleteHistoryOfALayer(layer.id);

            this.selectLayer(idNewLayerSelected);
            layersArray.splice(index, 1);

            delete layersMap[idLayerSelected];

            numberOfLayers--;

          }
        } 
      },

      deleteAllLayers: function() {
        layersMap = {};
        layersArray = [];
        numberOfLayers = 0;
        nextLayerId = 0; // TODO: Be careful
      }

    };

    // Initialize with one layer
    layers.selectLayer(layers.addNewLayer());

    /** API for history **/

    var history = (function() {
      var undoStack = [],
          redoStack = [],
          undoLimit = 20;

      return {
        addToHistory: function(snapshot) {
          redoStack = [];

          // If the undoStack is full, remove the first element
          if (undoStack.length === undoLimit) {
            undoStack.shift();
          }

          undoStack.push(snapshot);
        },

        undo: function() {

          if (undoStack.length === 1) {
            return;
          }

          var snapshot = undoStack.pop();
          
          if (!snapshot) {
            return snapshot;
          }

          // If this snapshot was made when the layer was created
          // then it is skipped because the layer is already created
          if (snapshot.isANewLayer) {
            redoStack.push(snapshot);
            snapshot = undoStack.pop();
          }

          redoStack.push(snapshot);
          return undoStack[undoStack.length-1];
        },

        redo: function() {
          var snapshot = redoStack.pop();

          if (!snapshot) {
            return snapshot;
          }

          // If this snapshot was made when the layer was created
          // then it is skipped because the layer is already created
          if (snapshot.isANewLayer) {
            undoStack.push(snapshot);
            snapshot = redoStack.pop();
          }

          undoStack.push(snapshot);
          return snapshot;
        },

        deleteHistoryOfALayer: function(id) {
          var i;
          id = parseInt(id, 10);

          for (i = 0; i < undoStack.length; i++) {
            if (undoStack[i].layer.id === id) {
              undoStack.splice(i, 1);
              i--;
            }
          }

          for (i = 0; i < redoStack.length; i++) {
            if (redoStack[i].layer.id === id) {
              redoStack.splice(i, 1);
              i--;
            }
          }
        },

        clearHistory: function() {
          undoStack = [];
          redoStack = [];
        }
      };
    
    }());

    /** Reset actual state **/
    var resetState = function() {
      layers.deleteAllLayers();
      history.clearHistory();

      // Re-initialize with one layer
      layers.selectLayer(layers.addNewLayer());
    };

    /** Canvas Operations **/

    // map of modes
    var modes = {};

    // Mode constructor
    var Mode = function(modeConfig) {
      this.name = modeConfig.name;
      this.globalCompositeOperation = modeConfig.globalCompositeOperation;
      this.handleMouseDown = modeConfig.handleMouseDown;
      this.handleMouseDrag = modeConfig.handleMouseDrag;
      this.handleMouseMove = modeConfig.handleMouseMove;
      this.handleMouseUp = modeConfig.handleMouseUp;
    };

    // create new Mode and add it to the map of available modes
    var createNewMode = function(name, globalCompositeOperation, handlers) {
      var newMode = new Mode({
        name: name,
        globalCompositeOperation: globalCompositeOperation || 'source-over',
        handleMouseDown: handlers.handleMouseDown,
        handleMouseDrag: handlers.handleMouseDrag,
        handleMouseMove: handlers.handleMouseMove,
        handleMouseUp: handlers.handleMouseUp
      });
      modes[name] = newMode;
      return newMode;
    };

    /** Brush Mode **/
    var brushMode = (function() {

      // Points needed to draw using the brush
      var drawingPoints = {
        oldPoint : {
          x: 0,
          y: 0
        },
        currentPoint : {
          x: 0,
          y: 0
        },
        currentMidPoint : {
          x: 0,
          y: 0
        },
        oldMidPoint : {
          x: 0,
          y: 0
        },
        initializePoints: function(x, y) {
          this.oldPoint.x = x;
          this.oldPoint.y = y;

          this.oldMidPoint.x = x;
          this.oldMidPoint.y = y;
        },
        calculateMidPoint: function(x, y) {
          this.currentPoint.x = x;
          this.currentPoint.y = y;

          this.currentMidPoint.x = (x + this.oldPoint.x)/2;
          this.currentMidPoint.y = (y + this.oldPoint.y)/2;

          return {
            oldPoint: this.oldPoint,
            currentPoint: this.currentPoint,
            currentMidPoint: this.currentMidPoint,
            oldMidPoint: this.oldMidPoint,
          };
        },
        setCurrentPoint: function(x, y) {
          this.currentMidPoint.x = x;
          this.currentMidPoint.y = y;
        },
        updatePoints : function() {
          // update old point for next iteration
          this.oldPoint.x = this.currentPoint.x;
          this.oldPoint.y = this.currentPoint.y;

          // update old middle point for next iteration
          this.oldMidPoint.x = this.currentMidPoint.x;
          this.oldMidPoint.y = this.currentMidPoint.y;
        }
      };

      var initializePoints = function(x, y) {
        drawingPoints.initializePoints(x, y);
      };

      var calculateMidPoint = function(x, y) {
        return drawingPoints.calculateMidPoint(x, y);
      };

      var updatePoints = function() {
        drawingPoints.updatePoints();
      };

      var press = function(settings) {
        var ctx = layersMap[settings.layerId].ctx;
        ctx.beginPath();
        draw(settings);
      };

      // draw a quadratic curve
      var draw = function(settings) {
        var ctx = layersMap[settings.layerId].ctx;
        ctx.beginPath();

        ctx.lineWidth = settings.brushSize;
        ctx.strokeStyle = settings.color;
        ctx.lineCap = settings.brushCap;
        ctx.globalCompositeOperation = settings.globalCompositeOperation;

        ctx.moveTo(settings.currentMidPoint.x, settings.currentMidPoint.y);
        ctx.quadraticCurveTo(settings.oldPoint.x+1, settings.oldPoint.y+1, settings.oldMidPoint.x, settings.oldMidPoint.y);
        ctx.stroke();
      };

      return {
        name: 'brush',
        globalCompositeOperation: 'source-over',
        initializePoints: initializePoints,
        calculateMidPoint: calculateMidPoint,
        updatePoints: updatePoints,
        press: press,
        draw: draw,
      };

    }());

    modes[brushMode.name] = brushMode;

    /** Eyedropper Mode **/
    var eyedropperMode = (function() {
      var press = function(settings) {
        var ctx = layersMap[settings.layerId].ctx;
        var imageData = ctx.getImageData(settings.x, settings.y, 1, 1);
        properties.foregroundColor = rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2]);
      };

      return {
        name: 'eyedropper',
        press: press
      };
    }());

    modes[eyedropperMode.name] = eyedropperMode;

    /** EraserBrush Mode **/
    var eraserBrushMode = (function() {
      return {
        name: 'eraserBrush',
        globalCompositeOperation: 'destination-out',
        initializePoints: brushMode.initializePoints,
        calculateMidPoint: brushMode.calculateMidPoint,
        updatePoints: brushMode.updatePoints,
        press: brushMode.press,
        draw: brushMode.draw,
      };
    }());
    
    modes[eraserBrushMode.name] = eraserBrushMode;

    /** Pencil Mode **/
    var pencilMode = (function() {

      var points = {
        oldX: 0,
        oldY: 0,
      };

      var press = function(settings) {
        var ctx = layersMap[settings.layerId].ctx;
        ctx.beginPath();
        ctx.moveTo(settings.x, settings.y);
        points.oldX = settings.x;
        points.oldY = settings.y;
        draw(settings);
      };

      // Draw a line
      var draw = function(settings) {
        var ctx = layersMap[settings.layerId].ctx;
        ctx.beginPath();

         // Set properties
        ctx.lineWidth = settings.pencilSize;
        ctx.strokeStyle = settings.color;
        ctx.lineCap = settings.pencilCap;
        ctx.globalCompositeOperation = settings.globalCompositeOperation;

        ctx.moveTo(points.oldX, points.oldY);
        ctx.lineTo(settings.x, settings.y);
        ctx.stroke();
        points.oldX = settings.x;
        points.oldY = settings.y;
      };

      return {
        name: 'pencil',
        globalCompositeOperation: 'source-over',
        press: press,
        draw: draw,
      };

    }());

    modes[pencilMode.name] = pencilMode;

    var canvasOperations = {},
        defaultMode = brushMode,
        selectedMode = defaultMode;

    // Public method to get selected mode
    var getSelectedMode = function() {
      return selectedMode;
    };

    // Public method get default mode
    var getDefaultMode = function() {
      return defaultMode;
    };

    // Function to convert rgb to hex
    var rgbToHex = function(red, green, blue) {
      return '#' + colorConversion.rgbToHex(red, green, blue);
    };

    var getMode = function(nameMode) {
      return modes[nameMode];
    };

    var setMode = function(nameMode) {
      selectedMode = modes[nameMode];
    };

    canvasOperations.setMode = setMode;
    canvasOperations.getMode = getMode;
    canvasOperations.getDefaultMode = getDefaultMode;
    canvasOperations.getSelectedMode = getSelectedMode;

    // Initialize mode
    canvasOperations.setMode(defaultMode.name);

    /** Filters **/

    var filters = [
      {
        name: 'Grayscale',
        filter: function(canvas, width, height) {
          var ctx = canvas.getContext('2d');
          var imageData = ctx.getImageData(0, 0, width, height);
          var data = imageData.data;
          var brightness;

          for (var i = 0; i < data.length; i += 4) {
            brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            data[i] = brightness;
            data[i + 1] = brightness;
            data[i + 2] = brightness;
          }

          ctx.putImageData(imageData, 0, 0);

        }
      },

      {
        name: 'Invert',
        filter: function(canvas, width, height) {
          var ctx = canvas.getContext('2d');
          var imageData = ctx.getImageData(0, 0, width, height);
          var data = imageData.data;

          for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }

          ctx.putImageData(imageData, 0, 0);

        }
      }
    ];

    /** Factory **/
    return {
      properties: properties,
      setProperties: setProperties,
      setInitialState: setInitialState,
      getState: getState,
      swapColors: swapColors,
      layers: layers,
      history: history,
      resetState: resetState,
      canvasOperations: canvasOperations,
      filters: filters
    };
  }]);
