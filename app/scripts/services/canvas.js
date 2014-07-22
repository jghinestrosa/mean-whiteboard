'use strict';

angular.module('meanWhiteboardApp')
  .factory('canvasFactory', ['colorConversionFactory', function (colorConversion) {

    // General properties
    var properties = {
      brushWidth: 30,
      brushCap: 'round',
      eraserWidth: 5,
      eraserCap: 'round',
      pencilWidth: 10,
      pencilCap: 'round',
      foregroundColor: '#00FF00',
      backgroundColor: '#ffffff',
      width: 500,
      height: 500,
    };

    var setProperties = function(updatedProperties) {
      updatedProperties = updatedProperties || {};

      var prop;
      for (prop in updatedProperties) {
        if (updatedProperties.hasOwnProperty(prop)) {
          properties[prop] = updatedProperties[prop];
        }
      }
    };

    var swapColors = function() {
      console.log('swapColors');
      var oldForegroundColor = properties.foregroundColor;
      properties.foregroundColor = properties.backgroundColor;
      properties.backgroundColor = oldForegroundColor;
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
      this.isSelected = true;
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

        // if there was already a selected layer, unselect it first
        if (selectedLayer) {
          selectedLayer.isSelected = false;
        }

        // set the latest layer as the selected layer
        selectedLayer = layersMap[id];
        numberOfLayers++;
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
        selectedLayer.isSelected = false;
        layersMap[id].isSelected = true;
        selectedLayer = layersMap[id];
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
      }
    };

    // Initialize with one layer
    layers.addNewLayer();

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
    var createNewMode = function(name, globalCompositeOperation, handleMouseDown, handleMouseDrag, handleMouseMove, handleMouseUp) {
      var newMode = new Mode({
        name: name,
        globalCompositeOperation: globalCompositeOperation || 'source-over',
        handleMouseDown: handleMouseDown,
        handleMouseDrag: handleMouseDrag,
        handleMouseMove: handleMouseMove,
        handleMouseUp: handleMouseUp
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
      var draw = function(ctx, pencilWidth, pencilCap, color, globalCompositeOperation, x, y) {
        // set properties
        ctx.lineWidth = pencilWidth;
        ctx.strokeStyle = color;
        ctx.lineCap = pencilCap;
        ctx.globalCompositeOperation = globalCompositeOperation;

        drawingPoints.currentPoint.x = x;
        drawingPoints.currentPoint.y = y;

        drawingPoints.currentMidPoint.x = (drawingPoints.currentPoint.x + drawingPoints.oldPoint.x)/2;
        drawingPoints.currentMidPoint.y = (drawingPoints.currentPoint.y + drawingPoints.oldPoint.y)/2;

        ctx.moveTo(drawingPoints.currentMidPoint.x, drawingPoints.currentMidPoint.y);
        ctx.quadraticCurveTo(drawingPoints.oldPoint.x, drawingPoints.oldPoint.y, drawingPoints.oldMidPoint.x, drawingPoints.oldMidPoint.y);
        ctx.stroke();

        // update points for next iteration
        drawingPoints.updatePoints();
      };

      var handleMouseDown = function(event) {
        event = event.originalEvent;
        drawingPoints.oldPoint.x = event.layerX-selectedLayer.offsetLeft;
        drawingPoints.oldPoint.y = event.layerY-selectedLayer.offsetTop;
        drawingPoints.oldMidPoint.x = drawingPoints.oldPoint.x;
        drawingPoints.oldMidPoint.y = drawingPoints.oldPoint.y;
        console.log('x: ' + (event.layerX-selectedLayer.offsetLeft) + ', y: ' + (event.layerY-selectedLayer.offsetTop));
        selectedLayer.ctx.beginPath();
        this.handleMouseDrag(event);
      };

      var handleMouseDrag = function(event) {
        if (event.originalEvent) {
          event = event.originalEvent;
        }
        draw(selectedLayer.ctx, properties.brushWidth, properties.brushCap, properties.foregroundColor, selectedMode.globalCompositeOperation, event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);

      };

      return createNewMode('brush', 'source-over', handleMouseDown, handleMouseDrag);

    }());

    /** Eyedropper Mode **/
    var eyedropperMode = (function() {

    // Private function for eyedropper
    var eyedropper = function(ctx, x, y) {
      var imageData = ctx.getImageData(x, y, 1, 1);
      properties.foregroundColor = rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2]);
    };

    var handleMouseDown = function(event) {
        event = event.originalEvent;
      console.log('x: ' + (event.layerX-selectedLayer.offsetLeft) + ', y: ' + (event.layerY-selectedLayer.offsetTop));
      eyedropper(selectedLayer.ctx, event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
    };

    return createNewMode('eyedropper', 'source-over', handleMouseDown);

    }());

    /** EraserBrush Mode **/
    var eraserBrushMode = (function() {
    
      var handleMouseDown = modes.brush.handleMouseDown;
      var handleMouseDrag = modes.brush.handleMouseDrag;
    
      return createNewMode('eraserBrush', 'destination-out', handleMouseDown, handleMouseDrag);

    }());

    /** Pencil Mode **/
    var pencilMode = (function() {

      var draw = function(ctx, pencilWidth, pencilCap, color, globalCompositeOperation, x, y) {
        // set properties
        ctx.lineWidth = pencilWidth;
        ctx.strokeStyle = color;
        ctx.lineCap = pencilCap;
        ctx.globalCompositeOperation = globalCompositeOperation;

        ctx.lineTo(x,y);
        ctx.stroke();

      };
    
      var handleMouseDown = function(event) {
        event = event.originalEvent;
        var ctx = selectedLayer.ctx;

        ctx.beginPath();
        ctx.moveTo(event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
        this.handleMouseDrag(event);
      };

      var handleMouseDrag = function(event) {
        if (event.originalEvent) {
          event = event.originalEvent;
        }
        draw(selectedLayer.ctx, properties.pencilWidth, properties.pencilCap, properties.foregroundColor, selectedMode.globalCompositeOperation, event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
      };

      return createNewMode('pencil', 'source-over', handleMouseDown, handleMouseDrag);

    }());

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

    // Function to convert hex to rgb
    var hexToRgb = function(hexValue) {
      return colorConversion.hexToRgb(hexValue);
    };

    var setMode = function(nameMode) {
      selectedMode = modes[nameMode];
    };

    canvasOperations.setMode = setMode;
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
      canvasOperations: canvasOperations
    };
  }]);
