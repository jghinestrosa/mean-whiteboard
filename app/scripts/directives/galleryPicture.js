'use strict';

angular.module('meanWhiteboardApp')
  .directive('galleryPicture', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the galleryPicture directive');
      }
    };
  });
