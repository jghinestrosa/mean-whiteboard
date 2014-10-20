'use strict';

angular.module('meanWhiteboardApp')
  .factory('uploadPictureFactory', function uploadPicture() {
    
    var pictureToUpload;

    var setPictureToUpload = function(dataURL) {
      pictureToUpload = dataURL;
    };

    var getPictureToUpload = function() {
      return pictureToUpload;
    };

    return {
      setPictureToUpload: setPictureToUpload,
      getPictureToUpload: getPictureToUpload
    };

  });
