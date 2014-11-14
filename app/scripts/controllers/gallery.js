'use strict';

angular.module('meanWhiteboardApp')
  .controller('GalleryCtrl', ['$scope', '$http', function ($scope, $http) {

    var GALLERY_PICTURES_URL = '/bd/galleryPictures';

    $scope.pictures = [];
    
    $scope.getGalleryPictures = function() {
      $http.get(GALLERY_PICTURES_URL).success(function(pictures) {
        console.log('OK');
        $scope.pictures = pictures;
      });
    };

    $scope.getGalleryPictures();

  }]);
