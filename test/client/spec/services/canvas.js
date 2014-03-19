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
      foregroundColor: '#00f',
      backgroundColor: '#f0f',
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

  it('should have one layer as initial state of the whiteboard', function() {
    var numberOfLayers = canvasFactory.layers.getNumberOfLayers();
    expect(numberOfLayers).toEqual(1);
  });

  it('should add one layer', function(){

    canvasFactory.layers.addNewLayer();

    var numberOfLayers = canvasFactory.layers.getNumberOfLayers();
    expect(numberOfLayers).toEqual(2);

  });


  it('should set a context to a layer object', function() {

    // Set id and mock context
    var id = 0,
        context = jasmine.createSpy('ctx');

    // Associate context to layer
    canvasFactory.layers.setContextToLayer(id, context);

    var layer = canvasFactory.layers.getLayers()[id];
    expect(layer.ctx).toBeDefined();
    expect(layer.ctx).toBe(context);

  });

  it('should set offset values to a layer object', function() {

    var id = 0,
        offsetLeft = 10,
        offsetTop = 10;

    // Set offsets to layer 'id'
    canvasFactory.layers.setOffsetToLayer(id, offsetLeft, offsetTop);

    expect(canvasFactory.layers.getLayers()[id].offsetLeft).toEqual(offsetLeft);
    expect(canvasFactory.layers.getLayers()[id].offsetTop).toEqual(offsetTop);

  });

  it('should select a layer by default', function() {
  
    var id = 0,
        layer = canvasFactory.layers.getLayers()[id];
    
    expect(canvasFactory.layers.getSelectedLayer()).not.toBeUndefined();
    expect(canvasFactory.layers.getSelectedLayer()).toBe(layer);
  
  });

  it('should select a layer', function() {

    var id = 1;

    canvasFactory.layers.addNewLayer();
    canvasFactory.layers.selectLayer(id);

    var layer = canvasFactory.layers.getLayers()[id];
    expect(canvasFactory.layers.getSelectedLayer()).toBe(layer);

  });

  it('should select a mode by default', function() {

    var defaultMode = canvasFactory.canvasOperations.getDefaultMode();
    expect(canvasFactory.canvasOperations.getSelectedMode()).toEqual(defaultMode);

  });

  it('should select a mode', function() {

    var mode = 'drawPencil';

    // Select a mode
    canvasFactory.canvasOperations.setMode(mode);

    // Check that the mode has been selected
    expect(canvasFactory.canvasOperations.getSelectedMode()).toEqual(mode);

  });

});
