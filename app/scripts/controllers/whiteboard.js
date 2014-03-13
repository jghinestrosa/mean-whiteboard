'use strict';

angular.module('meanWhiteboardApp')
  .controller('WhiteboardCtrl', function ($scope, canvasFactory) {
    
    $scope.properties = canvasFactory.properties;
    $scope.getLayers = canvasFactory.getLayers;
    $scope.getLastLayerAdded = canvasFactory.getLastLayerAdded;
    $scope.setContext = canvasFactory.setContext;
    $scope.addNewLayer = canvasFactory.addLayer;

  });
