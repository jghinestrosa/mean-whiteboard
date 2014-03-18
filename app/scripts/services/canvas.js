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
      firstColor: '#000000',
      secondColor: '#fff',
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

    /** Layers configuration **/

    var layers = {},
        layersMap = {},
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

    var addNewLayer = function() {
      var newLayer = new Layer();
      var id = getNextLayerId();

      layersMap[id] = newLayer;
      numberOfLayers++;
    };

    var getLayers = function() {
      return layersMap;
    };

    var getNumberOfLayers = function() {
      return numberOfLayers;
    };

    // Set context 2d to a layer
    var setContextToLayer = function(id, ctx) {
      layersMap[id].ctx = ctx;
    };

    // Set offset of canvas to layer
    var setOffsetToLayer = function(id, offsetLeft, offsetTop) {
      layersMap[id].offsetLeft = offsetLeft;
      layersMap[id].offsetTop = offsetTop;
    };

    // Select active context
    var selectLayer = function(id) {
      selectedLayer = layersMap[id];
    };

    var getSelectedLayer = function() {
      return selectedLayer;
    };

    layers.addNewLayer = addNewLayer;
    layers.getLayers = getLayers;
    layers.getNumberOfLayers = getNumberOfLayers;
    layers.getSelectedLayer = getSelectedLayer;
    layers.selectLayer = selectLayer;
    layers.setContextToLayer = setContextToLayer;
    layers.setOffsetToLayer = setOffsetToLayer;

    /** Canvas Operations **/

    var canvasOperations = {},
        selectedMode = 'drawBrush';

        // Public get selected mode
        var getSelectedMode = function() {
          return selectedMode;
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
        drawingPoints.oldPoint.x = event.clientX-selectedLayer.offsetLeft;
        drawingPoints.oldPoint.y = event.clientY-selectedLayer.offsetTop;
        drawingPoints.oldMidPoint.x = drawingPoints.oldPoint.x;
        drawingPoints.oldMidPoint.y = drawingPoints.oldPoint.y;
        _drawBrushMouseMove(event);
      };

      var _drawBrushMouseMove = function(event) {
        drawBrush(selectedLayer.ctx, properties.brushWidth, properties.brushCap, properties.firstColor, selectedLayer.globalCompositeOperation, event.clientX-selectedLayer.offsetLeft, event.clientY-selectedLayer.offsetTop);
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
          selectedMode = '';
        }

        // TODO: Finish with else ifs...


      };

    }());

    canvasOperations.setMode = setMode;
    canvasOperations.getSelectedMode = getSelectedMode;

    /** Factory **/
    return {
      properties: properties,
      setProperties: setProperties,
      layers: layers,
      canvasOperations: canvasOperations
    };
  });
