'use strict';

angular.module('meanWhiteboardApp')
  .controller('GalleryCtrl', ['$scope', '$http', function ($scope, $http) {

    var GALLERY_PICTURES_URL = '/bd/galleryPictures';
    var pictureId = 1;
    var numberOfPictures;

    $scope.pictures = [];
    $scope.picture = {};

    var getNumberOfPictures = function() {
      $http.get('/bd/count').success(function(count) {
        numberOfPictures = parseInt(count, 10);
      });
    };
    
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
      if (pictureId !== numberOfPictures) {
        pictureId++;
        getGalleryPicture(pictureId);
      }
    };

    $scope.getPreviousPicture = function() {
      if (pictureId === 1) {
        return;
      }
      pictureId--;
      getGalleryPicture(pictureId);
    };

    getNumberOfPictures();
    //$scope.getGalleryPictures();
    getGalleryPicture(pictureId);

  }]);
