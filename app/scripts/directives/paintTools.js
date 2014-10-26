'use strict';

angular.module('meanWhiteboardApp')
  .directive('paintTools', function () {
    return {
      templateUrl: 'templates/paintTools.html',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
      }
    };
  });
