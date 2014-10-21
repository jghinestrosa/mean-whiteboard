'use strict';

angular.module('meanWhiteboardApp')
  .factory('uploadPictureFactory', ['$http', function uploadPicture($http) {

    var UPLOAD_URL = '/uploadPicture';
    var pictureToUpload;

    var setPictureToUpload = function(dataURL) {
      pictureToUpload = dataURL;
    };

    var getPictureToUpload = function() {
      return pictureToUpload;
    };

    var upload = function(form) {
      if (!pictureToUpload || !form) {
        return false;
      }

      form.picture = pictureToUpload;
      $http.post(UPLOAD_URL, form).success(function(data) {
        console.log('Correctly uploaded');
      });
    };

    return {
      setPictureToUpload: setPictureToUpload,
      getPictureToUpload: getPictureToUpload,
      upload: upload
    };

  }]);
