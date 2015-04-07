'use strict';

angular.module('meanWhiteboardApp')
  .controller('GalleryCtrl', ['$scope', '$http', function ($scope, $http) {

    var GALLERY_PICTURES_URL = '/bd/galleryPictures';
    var pictureId = 1;

    $scope.pictures = [];
    $scope.picture = {};
    
    $scope.getGalleryPictures = function() {
      $http.get(GALLERY_PICTURES_URL).success(function(pictures) {
        console.log('OK');
        $scope.pictures = pictures;
      });
    };

    var getGalleryPicture = function(pictureId) {
      $http.get(GALLERY_PICTURES_URL + '/' + pictureId).success(function(picture) {
        console.log('OK');
        $scope.picture = picture;
      });
    };

    $scope.getNextPicture = function() {
      pictureId++;
      getGalleryPicture(pictureId);
    };

    $scope.getPreviousPicture = function() {
      pictureId--;
      getGalleryPicture(pictureId);
    };

    //$scope.getGalleryPictures();
    getGalleryPicture(pictureId);

  }]);
