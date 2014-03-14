'use strict';

describe('Directive: whiteboard', function () {

  var whiteboardCtrl,
      canvasFactory,
      $rootScope,
      $compile,
      template;

  // Load module and template needed
  beforeEach(module('meanWhiteboardApp', 'app/templates/whiteboard.html'));

  beforeEach(inject(function(_$rootScope_, $controller, $templateCache, _$compile_, _canvasFactory_) {
    $rootScope = _$rootScope_;
    whiteboardCtrl = $controller('WhiteboardCtrl', {$scope : $rootScope, canvasFactory : _canvasFactory_});
    $compile = _$compile_;
    canvasFactory = _canvasFactory_;

    // Put template needed in cache
    template = $templateCache.get('app/templates/whiteboard.html');
    $templateCache.put('templates/whiteboard.html', template);
  }));

  it('should add a new layer', function(){

    // Check that there is no layers yet
    expect(canvasFactory.layers.getNumberOfLayers()).toEqual(0);

    //Compile the 'whiteboard' directive and check that a layer has been added
    $compile('<whiteboard></whiteboard>')($rootScope);
    $rootScope.$digest();
    expect(canvasFactory.layers.getNumberOfLayers()).toEqual(1);

  });

  it('should select a mode', function(){

    var mode = 'drawPencil';

    // Check that there is no selected mode
    expect(canvasFactory.canvasOperations.getSelectedMode()).toEqual('');

    //Compile the 'whiteboard' directive and check that a mode has been selected
    $compile('<whiteboard></whiteboard>')($rootScope);
    $rootScope.$digest();
    expect(canvasFactory.canvasOperations.getSelectedMode()).toEqual(mode);

  });

});
