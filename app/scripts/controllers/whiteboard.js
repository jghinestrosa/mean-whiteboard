'use strict';

angular.module('meanWhiteboardApp')
  .controller('WhiteboardCtrl', function ($scope, canvasFactory) {
    
    $scope.properties = canvasFactory.properties;
    $scope.getLayers = canvasFactory.getLayers;
    canvasFactory.addLayer();

  });
