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

    var layers = [];

    var setProperties = function(updatedProperties) {
	    updatedProperties = updatedProperties || {};

	    var prop;
	    for (prop in updatedProperties) {
	        if (updatedProperties.hasOwnProperty(prop)) {
			properties[prop] = updatedProperties.prop;
		}
	    }
    };

    var getLayers = function() {
	    return layers;
    };

    var addLayer = function() {
    
    };

    return {};
  });
