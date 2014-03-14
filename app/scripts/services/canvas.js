'use strict';

angular.module('meanWhiteboardApp')
  .factory('canvasFactory', function () {

    // General properties
    var properties = {
      brushWidth: 5,
      brushCap: 'round',
      eraserWidth: 5,
      eraserCap: 'round',
      pencilWidth: 5,
      pencilCap: 'square',
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
        selectedMode = '';

    // Public get selected mode
    var getSelectedMode = function() {
      return selectedMode;
    };

    // Private drawPencil function
    var drawPencil = function(ctx, pencilWidth, pencilCap, color, globalCompositeOperation, x, y) {
      ctx.lineWidth = pencilWidth;
      ctx.strokeStyle = color;
      ctx.lineCap = pencilCap;
      ctx.globalCompositeOperation = globalCompositeOperation;

      ctx.lineTo(x, y);
      ctx.stroke();

    };

    var beginPath = function() {
      selectedLayer.ctx.beginPath();
    };
    
    var setMode = function(mode) {
      (function(mode) {
        if (mode === 'drawPencil') {
          canvasOperations.handleMouseMove = function(event) {
            drawPencil(selectedLayer.ctx, properties.pencilWidth, properties.pencilCap, properties.firstColor, selectedLayer.globalCompositeOperation, event.clientX-selectedLayer.offsetLeft, event.clientY-selectedLayer.offsetTop);
          };
          canvasOperations.handleMouseDown = canvasOperations.handleMouseMove;
          canvasOperations.handleMouseUp = beginPath;
        }

        // TODO: Finish with else ifs...

        // Update selected mode
        selectedMode = mode;

      }(mode));
    };

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
