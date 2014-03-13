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
      height: 500
    };

    var setProperties = function(updatedProperties) {
      updatedProperties = updatedProperties || {};

      var prop;
      for (prop in updatedProperties) {
        if (updatedProperties.hasOwnProperty(prop)) {
          properties[prop] = updatedProperties.prop;
        }
      }
    };

    var layers = [],
        nextLayerId = 0;

    var getNextLayerId = function() {
      return nextLayerId++;
    };

    // Layer constructor
    var Layer = function() {
      this.id = getNextLayerId();
      this.globalCompositeOperation = 'source-over';
      this.globalAlpha = 1.0;
    };

    var addLayer = function() {
      layers.push(new Layer());
    };

    var getLayers = function() {
      return layers;
    };

    return {
      properties: properties,
      setProperties: setProperties,
      addLayer: addLayer,
      getLayers: getLayers
    };
  });
