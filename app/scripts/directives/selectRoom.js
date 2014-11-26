'use strict';

angular.module('meanWhiteboardApp')
  .directive('selectRoom', function () {
    return {
      templateUrl: 'templates/selectRoom.html',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
      }
    };
  });
