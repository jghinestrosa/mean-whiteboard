'use strict';

angular.module('meanWhiteboardApp')
  .controller('GalleryCtrl', ['$scope', '$http', function ($scope, $http) {

    var GALLERY_PICTURES_URL = '/bd/galleryPictures';

    $scope.pictures = [];
    
    $scope.getGalleryPictures = function() {
      $http.get(GALLERY_PICTURES_URL).success(function(data) {
        console.log('OK');
        console.log(data);
      });
    };

    $scope.getGalleryPictures();

  }]);
