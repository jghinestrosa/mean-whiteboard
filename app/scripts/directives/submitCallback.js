'use strict';

angular.module('meanWhiteboardApp')
  .directive('submitCallback', function () {
    return {
      restrict: 'A',
      scope: {
        callback: '&submitCallback'
      },
      link: function postLink(scope, element, attrs) {
        element.on('submit', function(e) {
          e.preventDefault();
          scope.callback();
        });
      }
    };
  });
