'use strict';

angular.module('meanWhiteboardApp')
  .controller('UploadPictureCtrl', function ($scope, $location, uploadPictureFactory) {
    
    $scope.form = {};

    $scope.goBack = function() {
      $location.url('/');
    };

    $scope.pictureToUpload = uploadPictureFactory.getPictureToUpload();

    $scope.submit = function() {
      console.log('submit');
      uploadPictureFactory.upload($scope.form);
    };

  });
