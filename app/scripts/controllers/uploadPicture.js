'use strict';

angular.module('meanWhiteboardApp')
  .controller('UploadPictureCtrl', function ($scope, $location, uploadPictureFactory) {
    
    $scope.goBack = function() {
      $location.url('/');
    };

    $scope.pictureToUpload = uploadPictureFactory.getPictureToUpload();

  });
