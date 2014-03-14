'use strict';

describe('Directive: layer', function () {
  var $compile,
      $rootScope;

  beforeEach(module('meanWhiteboardApp'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('assigns the layer-id attribute to a scope property', function() {
    
    // Set mock properties and methods in scope
    $rootScope.id = 0;
    $rootScope.setContext = jasmine.createSpy('mock setContext');
    
    // Compile HTML and fire all the watches
    var element = $compile("<canvas layer-id='{{id}}'></canvas>")($rootScope);
    $rootScope.$digest();

    // Check that the element has a 'layer-id' attribute assigned to '0'
    expect(element[0].getAttribute('layer-id')).toEqual('0');

  });

  it('should assigns a canvas context to a layer object', inject(function(canvasFactory) {

    // Set properties in scope
    $rootScope.id = 0;
    $rootScope.setContext = canvasFactory.setContext;

    // Compile HTML and fire all the watches
    var element = $compile("<canvas layer-id='{{id}}'></canvas>")($rootScope);
    $rootScope.$digest();

    // Check that the canvas element context is the same that is stored in the layer object
    var ctx = element[0].getContext('2d');
    var layer = canvasFactory.getLayers()[$rootScope.id];
    expect(layer.ctx).toBe(ctx);

  }));

});
