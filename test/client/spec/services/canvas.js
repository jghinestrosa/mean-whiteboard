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

  // TODO Change when whiteboard starts with one layer
  it('should have zero layers', function() {
    var numberOfLayers = canvasFactory.getNumberOfLayers();
    expect(numberOfLayers).toEqual(0);
  });

  // TODO Change to two layers when whiteboard starts with one layer
  it('should have one layer', function(){

    canvasFactory.addNewLayer();

    var numberOfLayers = canvasFactory.getNumberOfLayers();
    expect(numberOfLayers).toEqual(1);
  
  });


  it('should set a context to a layer object', function(){
    //TODO This won't be necessary when whiteboard starts with one layer by default
    canvasFactory.addNewLayer();

    // Set id and mock context
    var id = 0;
    var context = jasmine.createSpy('ctx');

    // Associate context to layer
    canvasFactory.setContext(id, context);

    var layer = canvasFactory.getLayers()[id];
    expect(layer.ctx).toBeDefined();
  
  });

});
