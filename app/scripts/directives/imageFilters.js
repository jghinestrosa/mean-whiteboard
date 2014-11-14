'use strict';

angular.module('meanWhiteboardApp')
  .directive('imageFilters', function () {
    return {
      templateUrl: 'templates/imageFilters.html',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
      }
    };
  });
