'use strict';

describe('Service: canvasFactory', function () {

  beforeEach(module('meanWhiteboardApp'));

  var canvasFactory;
  beforeEach(inject(function (_canvasFactory_) {
    canvasFactory = _canvasFactory_;
  }));

  it('should set new values to all properties', function(){

    // New properties to set
    var newProperties = {
      brushWidth: 2,
      brushCap: 'round',
      eraserWidth: 3,
      eraserCap: 'butt',
      pencilWidth: 4,
      pencilCap: 'square',
      firstColor: '#00f',
      secondColor: '#f0f',
      width: 300,
      height: 500,
    };

    canvasFactory.setProperties(newProperties);

    // Get properties from factory
    var properties = canvasFactory.properties;
    
    // Check each property value
    var prop;
    for (prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        expect(properties[prop]).toEqual(newProperties[prop]);
      }
    }

  });

  it('should set a new value to one property and let the rest of them with the same value', function() {

    // Initial properties
    var initProperties = canvasFactory.properties;

    var newProperty = {
      pencilWidth: 1
    };

    // Change one property and get result
    canvasFactory.setProperties(newProperty);
    var properties = canvasFactory.properties;

    // Check all properties have the same value except pencilWidth
    var prop;
    for (prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        if(prop === 'pencilWidth') {
          expect(properties[prop]).toEqual(1);
        }
        else {
          expect(properties[prop]).toEqual(initProperties[prop]);
        }
      }
    }
  
  });

  it('should have zero layers', function() {
    var numberOfLayers = canvasFactory.layers.getNumberOfLayers();
    expect(numberOfLayers).toEqual(0);
  });

  it('should have one layer', function(){

    canvasFactory.layers.addNewLayer();

    var numberOfLayers = canvasFactory.layers.getNumberOfLayers();
    expect(numberOfLayers).toEqual(1);
  
  });


  it('should set a context to a layer object', function(){

    // Set id and mock context
    var id = 0;
    var context = jasmine.createSpy('ctx');

    // Add a new layer
    canvasFactory.layers.addNewLayer();

    // Associate context to layer
    canvasFactory.layers.setContextToLayer(id, context);

    var layer = canvasFactory.layers.getLayers()[id];
    expect(layer.ctx).toBeDefined();
    expect(layer.ctx).toBe(context);
  
  });

  it('should set offset values to a layer object', function(){

    var id = 0,
        offsetLeft = 10,
        offsetTop = 10;

    // Add a new layer
    canvasFactory.layers.addNewLayer();

    // Set offsets to layer 'id'
    canvasFactory.layers.setOffsetToLayer(id, offsetLeft, offsetTop);

    expect(canvasFactory.layers.getLayers()[id].offsetLeft).toEqual(offsetLeft);
    expect(canvasFactory.layers.getLayers()[id].offsetTop).toEqual(offsetTop);


  });

});
