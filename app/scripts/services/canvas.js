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

      addNewLayer:  function() {
        // create and select a new layer
        var id = getNextLayerId();
        var newLayer = new Layer(id);

        // the new layer is added to the map and the array
        layersMap[id] = newLayer;
        layersArray.push(newLayer);

        // set the latest layer as the selected layer
        //this.selectLayer(id);

        numberOfLayers++;

        return id;
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

      moveUp: function() {
        for (var i = 0; i < layersArray.length; i++) {
          if (layersArray[i].id === selectedLayer.id) {
            if (i !== 0) {
              var previousLayer = layersArray[i-1];
              layersArray[i-1] = selectedLayer;
              layersArray[i] = previousLayer;
              break;
            }
          }
        }
      },

      moveDown: function() {
        for (var i = 0; i < layersArray.length; i++) {
          if (layersArray[i].id === selectedLayer.id) {
            if (i !== layersArray.length-1) {
              var nextLayer = layersArray[i+1];
              layersArray[i+1] = selectedLayer;
              layersArray[i] = nextLayer;
              break;
            }
          }
        }
      },

      deleteSelectedLayer: function() {
        if (numberOfLayers !== 1) {
          var index = layersArray.indexOf(selectedLayer);
          var idNewLayerSelected;

          if (index !== -1) {
            var idLayerSelected = selectedLayer.id;

            // if the layer is in the last position, select the previous layer
            if (index === layersArray.length-1) {
              idNewLayerSelected = layersArray[index-1].id;
            }

            // if not, select the next layer
            else {
              idNewLayerSelected = layersArray[index+1].id;
            }

            // delete all history related to the layer
            history.deleteHistoryOfALayer(selectedLayer.id);

            this.selectLayer(idNewLayerSelected);
            layersArray.splice(index, 1);

            delete layersMap[idLayerSelected];

          }
        } 
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
            undoStack.splice(0, 1);
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
        }

      };
    
    }());

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

      // private function for smooth drawing
      //var draw = function(ctx, pencilSize, pencilCap, color, globalCompositeOperation, x, y) {
         //set properties
        //ctx.lineWidth = pencilSize;
        //ctx.strokeStyle = color;
        //ctx.lineCap = pencilCap;
        //ctx.globalCompositeOperation = globalCompositeOperation;

        //drawingPoints.currentPoint.x = x;
        //drawingPoints.currentPoint.y = y;

        //drawingPoints.currentMidPoint.x = (drawingPoints.currentPoint.x + drawingPoints.oldPoint.x)/2;
        //drawingPoints.currentMidPoint.y = (drawingPoints.currentPoint.y + drawingPoints.oldPoint.y)/2;

        //ctx.moveTo(drawingPoints.currentMidPoint.x, drawingPoints.currentMidPoint.y);
        //ctx.quadraticCurveTo(drawingPoints.oldPoint.x, drawingPoints.oldPoint.y, drawingPoints.oldMidPoint.x, drawingPoints.oldMidPoint.y);
        //ctx.stroke();

         //update points for next iteration
        //drawingPoints.updatePoints();
      //};

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
        ctx.quadraticCurveTo(settings.oldPoint.x, settings.oldPoint.y, settings.oldMidPoint.x, settings.oldMidPoint.y);
        ctx.stroke();
      };

      // TODO: Move this function to the controller
      //var handleMouseUp = function() {
        //history.addToHistory({
          //dataURL: selectedLayer.canvas.toDataURL('img/png'),
          //layer: selectedLayer,
          //isANewLayer: false
        //});
      //};

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
    //var eyedropperMode = (function() {

     //Private function for eyedropper
    //var eyedropper = function(ctx, x, y) {
      //var imageData = ctx.getImageData(x, y, 1, 1);
      //properties.foregroundColor = rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2]);
    //};

    //var handleMouseDown = function(event) {
        //event = event.originalEvent;
      //console.log('x: ' + (event.layerX-selectedLayer.offsetLeft) + ', y: ' + (event.layerY-selectedLayer.offsetTop));
      //eyedropper(selectedLayer.ctx, event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
    //};

    //var handlers = {
      //handleMouseDown: handleMouseDown
    //};

    //return createNewMode('eyedropper', 'source-over', handlers);

    //}());

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
    //var pencilMode = (function() {

      //var draw = function(ctx, pencilSize, pencilCap, color, globalCompositeOperation, x, y) {
         //set properties
        //ctx.lineWidth = pencilSize;
        //ctx.strokeStyle = color;
        //ctx.lineCap = pencilCap;
        //ctx.globalCompositeOperation = globalCompositeOperation;

        //ctx.lineTo(x,y);
        //ctx.stroke();

      //};
    
      //var handleMouseDown = function(event) {
        //event = event.originalEvent;
        //var ctx = selectedLayer.ctx;

        //ctx.beginPath();
        //ctx.moveTo(event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
        //this.handleMouseDrag(event);
      //};

      //var handleMouseDrag = function(event) {
        //if (event.originalEvent) {
          //event = event.originalEvent;
        //}
        //draw(selectedLayer.ctx, properties.pencilSize, properties.pencilCap, properties.foregroundColor, selectedMode.globalCompositeOperation, event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
      //};

      //var handlers = {
        //handleMouseDown: handleMouseDown,
        //handleMouseDrag: handleMouseDrag
      //};

      //return createNewMode('pencil', 'source-over', handlers);

    //}());

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

    /** Factory **/
    return {
      properties: properties,
      setProperties: setProperties,
      swapColors: swapColors,
      layers: layers,
      history: history,
      canvasOperations: canvasOperations
    };
  }]);
