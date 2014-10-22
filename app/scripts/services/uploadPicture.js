'use strict';

angular.module('meanWhiteboardApp')
  .factory('uploadPictureFactory', ['$http', function uploadPicture($http) {

    var UPLOAD_URL = '/bd/uploadPicture';
    var pictureToUpload;

    // Store the picture from WhiteboardCtrl
    var setPictureToUpload = function(dataURL) {
      pictureToUpload = dataURL;
    };

    var getPictureToUpload = function() {
      return pictureToUpload;
    };

    // Upload a picture to the server
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
