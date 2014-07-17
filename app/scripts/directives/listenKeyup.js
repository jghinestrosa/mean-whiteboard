'use strict';

angular.module('meanWhiteboardApp')
  .directive('listenKeyup', function () {
    return {
      restrict: 'A',
      scope: {
        handler: '&listenKeyup',
        maxNum: '@'
      },
      link: function postLink(scope, element, attrs) {
        //element.on('keypress', scope.handler);
        var value;
        element.on('keyup', function() {
          element.off('blur');
          value = element.val();
          value = value.replace(/^(-)?0+(?=\d)/, '');

          // if there is no number
          if (!value) {
            element.on('blur', function() {
              element.val('0');
              element.off('blur');
            });
          }

          // if the number is greater than the limit number
          if (scope.maxNum) {
            if (parseInt(value, 10) > parseInt(scope.maxNum, 10)) {
              value = scope.maxNum;
            }
          }

          element.val(value);

          // call the handler function
          if (scope.handler) {
            scope.$apply(function() {
              scope.handler({h:parseInt(value,10)});
            });
          }

        });
      }
    };
  });
