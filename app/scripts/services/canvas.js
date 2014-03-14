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
      pencilCap: 'round',
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

    var layers = {},
        nextLayerId = 0,
        numberOfLayers = 0;

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

      layers[id] = newLayer;
      numberOfLayers++;
    };

    var getLayers = function() {
      return layers;
    };

    var getNumberOfLayers = function() {
      return numberOfLayers;
    };

    // Set context 2d to a layer
    var setContext = function(id, ctx) {
      layers[id].ctx = ctx;
    };

    return {
      properties: properties,
      setProperties: setProperties,
      addNewLayer: addNewLayer,
      getNumberOfLayers: getNumberOfLayers,
      getLayers: getLayers,
      setContext: setContext
    };
  });
