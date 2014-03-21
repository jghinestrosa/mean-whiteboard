'use strict';

angular.module('meanWhiteboardApp')
  .factory('canvasFactory', function () {

    // General properties
    var properties = {
      brushWidth: 30,
      brushCap: 'round',
      eraserWidth: 5,
      eraserCap: 'round',
      pencilWidth: 35,
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
        nextLayerId = 0,
        numberOfLayers = 0,
        selectedLayer;

    var getNextLayerId = function() {
      return nextLayerId++;
    };

    // Layer constructor
    var Layer = function() {
      this.globalCompositeOperation = 'source-over';
      this.globalAlpha = 1.0;
    };

    /** API for layers **/
    var layers = {

      addNewLayer:  function() {
        var newLayer = new Layer();
        var id = getNextLayerId();

        // a new layer is selected and added to the map
        layersMap[id] = newLayer;
        selectedLayer = layersMap[id];
        numberOfLayers++;
      },

      getLayers: function() {
        return layersMap;
      },

      getNumberOfLayers: function() {
        return numberOfLayers;
      },

      getSelectedLayer: function() {
        return selectedLayer;
      },

      // Select active context
      selectLayer: function(id) {
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
      }
    };

    // Initialize with one layer
    layers.addNewLayer();

    /** Canvas Operations **/

    var canvasOperations = {},
        defaultMode = 'drawBrush',
        selectedMode = defaultMode;

    // Public method to get selected mode
    var getSelectedMode = function() {
      return selectedMode;
    };

    // Public method get default mode
    var getDefaultMode = function() {
      return defaultMode;
    };

    // Points needed to draw using the pencil or the brush
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

    // Private drawPencil function
    var drawBrush = function(ctx, pencilWidth, pencilCap, color, globalCompositeOperation, x, y) {
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

    // Function to convert rgb to hex
    var rgbToHex = function(red, green, blue) {
      var redToHex = red.toString(16);
      var greenToHex = green.toString(16);
      var blueToHex = blue.toString(16);

      if(redToHex.length === 1) {
        redToHex = '0' + redToHex;
      }

      if(greenToHex.length === 1) {
        greenToHex = '0' + greenToHex;
      }

      if(blueToHex.length === 1) {
        blueToHex = '0' + blueToHex;
      }

      return '#' + redToHex + greenToHex + blueToHex;
    };


    // Private function for eyedropper
    var eyedropper = function(ctx, x, y) {
      var imageData = ctx.getImageData(x, y, 1, 1);
      properties.foregroundColor = rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2]);
    };


    var setMode = (function() {

      /** Private event handlers when drawing **/
      var _drawBrushMouseDown = function(event) {
        drawingPoints.oldPoint.x = event.layerX-selectedLayer.offsetLeft;
        drawingPoints.oldPoint.y = event.layerY-selectedLayer.offsetTop;
        drawingPoints.oldMidPoint.x = drawingPoints.oldPoint.x;
        drawingPoints.oldMidPoint.y = drawingPoints.oldPoint.y;
        console.log('x: ' + (event.layerX-selectedLayer.offsetLeft) + ', y: ' + (event.layerY-selectedLayer.offsetTop));
        selectedLayer.ctx.beginPath();
        _drawBrushMouseMove(event);
      };

      var _drawBrushMouseMove = function(event) {
        drawBrush(selectedLayer.ctx, properties.brushWidth, properties.brushCap, properties.foregroundColor, selectedLayer.globalCompositeOperation, event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
      };

      var _drawBrushMouseUp = function() {
        //selectedLayer.ctx.beginPath();
      };

      /** Private event handlers when eyedropping **/
      var _eyedropper = function(event) {
        console.log('x: ' + (event.layerX-selectedLayer.offsetLeft) + ', y: ' + (event.layerY-selectedLayer.offsetTop));
        eyedropper(selectedLayer.ctx, event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
      };


      /** setMode function **/
      return function(mode) {

        // Update selected mode
        selectedMode = mode;

        if (mode === 'drawBrush') {
          canvasOperations.handleMouseDown = _drawBrushMouseDown;
          canvasOperations.handleMouseMove = _drawBrushMouseMove;
          canvasOperations.handleMouseUp = _drawBrushMouseUp;
        }
        else if (mode === 'drawPencil') {

        }
        else if (mode === 'eyedropper') {
          canvasOperations.handleMouseDown = _eyedropper;
          canvasOperations.handleMouseMove = '';
          canvasOperations.handleMouseUp = '';
        }
        else {
          selectedMode = defaultMode;
        }

        // TODO: Finish with else ifs...


      };

    }());

    canvasOperations.setMode = setMode;
    canvasOperations.getDefaultMode = getDefaultMode;
    canvasOperations.getSelectedMode = getSelectedMode;

    // Initialize mode
    canvasOperations.setMode(defaultMode);

    /** Factory **/
    return {
      properties: properties,
      setProperties: setProperties,
      swapColors: swapColors,
      layers: layers,
      canvasOperations: canvasOperations
    };
  });
