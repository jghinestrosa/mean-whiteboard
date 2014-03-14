'use strict';

describe('Directive: layer', function () {
  var $compile,
      $rootScope;

  beforeEach(module('meanWhiteboardApp'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('assigns the id property of scope to the layer-id attribute', function() {
    
    // Set mock properties and methods in scope
    $rootScope.id = 0;
    $rootScope.setContextToLayer = jasmine.createSpy('mock setContext');
    $rootScope.setOffsetToLayer = jasmine.createSpy('mock setOffsetToLayer');
    $rootScope.getNumberOfLayers = jasmine.createSpy('mock getNumberOfLayers').andReturn(0);
    
    // Compile HTML and fire all the watches
    var element = $compile("<canvas layer-id='{{id}}'></canvas>")($rootScope);
    $rootScope.$digest();

    // Check that the element has a 'layer-id' attribute assigned to '0'
    expect(element[0].getAttribute('layer-id')).toEqual('0');

  });

  it('should assigns a canvas context to a layer object', inject(function(canvasFactory) {

    // Set properties in scope
    $rootScope.id = 0;
    $rootScope.setContextToLayer = canvasFactory.layers.setContextToLayer;
    $rootScope.setOffsetToLayer = jasmine.createSpy('mock setOffsetToLayer');
    $rootScope.getNumberOfLayers = jasmine.createSpy('mock getNumberOfLayers').andReturn(0);
    canvasFactory.layers.addNewLayer();

    // Compile HTML and fire all the watches
    var element = $compile("<canvas layer-id='{{id}}'></canvas>")($rootScope);
    $rootScope.$digest();

    // Check that the canvas element context is the same that is stored in the layer object
    var ctx = element[0].getContext('2d');
    var layer = canvasFactory.layers.getLayers()[$rootScope.id];
    expect(layer.ctx).toBe(ctx);

  }));

  it('should assign the offset values to a layer object', inject(function(canvasFactory) {

    $rootScope.id = 0;
    $rootScope.setContextToLayer = jasmine.createSpy('mock setContextToLayer');
    $rootScope.setOffsetToLayer = canvasFactory.layers.setOffsetToLayer;
    $rootScope.getNumberOfLayers = jasmine.createSpy('mock getNumberOfLayers').andReturn(0);
    canvasFactory.layers.addNewLayer();

    // Check that the layer does not have an initial offset
    var layer = canvasFactory.layers.getLayers()[$rootScope.id];
    expect(layer.offsetLeft).toBeUndefined();
    expect(layer.offsetTop).toBeUndefined();

    // Compile HTML and fire all the watches
    $compile("<canvas layer-id='{{id}}'></canvas>")($rootScope);
    $rootScope.$digest();

    expect(layer.offsetLeft).toBeDefined();
    expect(layer.offsetTop).toBeDefined();

  }));

  it('should select the initial layer', inject(function(canvasFactory) {

    $rootScope.id = 0;
    $rootScope.setContextToLayer = jasmine.createSpy('mock setContextToLayer');
    $rootScope.setOffsetToLayer = jasmine.createSpy('mock setOffsetToLayer');
    $rootScope.getNumberOfLayers = canvasFactory.layers.getNumberOfLayers;
    $rootScope.selectLayer = canvasFactory.layers.selectLayer;

    canvasFactory.layers.addNewLayer();

    // Check there is no layer selected
    expect(canvasFactory.layers.getSelectedLayer()).toBeUndefined();

    // Get inserted layer
    var layer = canvasFactory.layers.getLayers()[$rootScope.id];

    // Compile HTML and fire all the watches
    $compile("<canvas layer-id='{{id}}'></canvas>")($rootScope);
    $rootScope.$digest();

    // Check that the selected layer is the same inserted before
    expect(canvasFactory.layers.getSelectedLayer()).toBe(layer);

  }));

});
