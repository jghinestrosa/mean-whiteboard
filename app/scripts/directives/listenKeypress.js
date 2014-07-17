'use strict';

angular.module('meanWhiteboardApp')
  .directive('listenKeypress', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        console.log(element);
      }
    };
  });
