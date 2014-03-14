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
      firstColor: '#000',
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

    // Select active context
    var selectLayer = function(id){
      selectedLayer = layersMap[id];
    };

    // Initialize layers
    addNewLayer();

    layers.addNewLayer = addNewLayer;
    layers.getLayers = getLayers;
    layers.getNumberOfLayers = getNumberOfLayers;
    layers.selectLayer = selectLayer;
    layers.setContextToLayer = setContextToLayer;

    /** Canvas Operations **/

    var canvasOperations = {},
        handleMouseDown,
        handleMouseMove,
        handleMouseUp;

    // Private drawPencil function
    var drawPencil = function(ctx, pencilWidth, pencilCap, color, globalCompositeOperation, x, y) {
      ctx.lineWidth = pencilWidth;
      ctx.strokeStyle = color;
      ctx.lineCap = pencilCap;
      ctx.globalCompositeOperation = globalCompositeOperation;

      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.stroke();
    };

    // Public drawPencil method
    canvasOperations.drawPencil = function(event) {
      drawPencil(selectedLayer.ctx, properties.pencilWidth, properties.pencilCap, properties.firstColor, selectedLayer.globalCompositeOperation, event.clientX, event.clientY);
    };

    var setMode = function(mode) {
      if (mode === 'drawPencil') {
        handleMouseDown = canvasOperations.drawPencil;
        handleMouseMove = canvasOperations.drawPencil;
      }
    };

    return {
      properties: properties,
      setProperties: setProperties,
      layers: layers,
      canvasOperations: canvasOperations
    };
  });
