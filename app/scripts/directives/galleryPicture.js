'use strict';

angular.module('meanWhiteboardApp')
  .directive('galleryPicture', function () {
    return {
      templateUrl: 'templates/galleryPicture.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
