'use strict';

describe('Controller: WhiteboardCtrl', function () {

  beforeEach(module('meanWhiteboardApp'));

  var canvasFactory,
      $scope,
      whiteboardCtrl;

  beforeEach(inject(function($controller, _canvasFactory_){
    $scope = {};
    canvasFactory = _canvasFactory_;
    whiteboardCtrl = $controller('WhiteboardCtrl', {$scope: $scope, canvasFactory: canvasFactory});
  }));
  
  it('should reference to properties object in canvasFactory', function() {
    expect($scope.properties).toBe(canvasFactory.properties);
  });
  
  it('should reference to getLayers method in canvasFactory', function() {
    expect($scope.getLayers).toBe(canvasFactory.layers.getLayers);
  });

  it('should reference to getLastLayerAdded method in canvasFactory', function() {
    expect($scope.getLastLayerAdded).toBe(canvasFactory.layers.getLastLayerAdded);
  });

  it('should reference to setContext method in canvasFactory', function() {
    expect($scope.setContext).toBe(canvasFactory.layers.setContext);
  });

  it('should reference to addNewLayer method in canvasFactory', function() {
    expect($scope.addNewLayer).toBe(canvasFactory.layers.addNewLayer);
  });

});
