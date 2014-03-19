'use strict';

angular.module('meanWhiteboardApp')
  .factory('canvasFactory', function () {

    // General properties
    var properties = {
      brushWidth: 5,
      brushCap: 'round',
      eraserWidth: 5,
      eraserCap: 'round',
      pencilWidth: 35,
      pencilCap: 'round',
      foregroundColor: '#000000',
      backgroundColor: '#fff',
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

    var setMode = (function() {

      /** Private event handlers when drawing **/
      var _drawBrushMouseDown = function(event) {
        drawingPoints.oldPoint.x = event.layerX-selectedLayer.offsetLeft;
        drawingPoints.oldPoint.y = event.layerY-selectedLayer.offsetTop;
        drawingPoints.oldMidPoint.x = drawingPoints.oldPoint.x;
        drawingPoints.oldMidPoint.y = drawingPoints.oldPoint.y;
        _drawBrushMouseMove(event);
      };

      var _drawBrushMouseMove = function(event) {
        drawBrush(selectedLayer.ctx, properties.brushWidth, properties.brushCap, properties.firstColor, selectedLayer.globalCompositeOperation, event.layerX-selectedLayer.offsetLeft, event.layerY-selectedLayer.offsetTop);
      };

      var _drawBrushMouseUp = function() {
        selectedLayer.ctx.beginPath();
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
