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
        var value;
        element.on('keyup', function() {
          element.off('blur');
          value = element.val();

          // remove leading zeros
          value = value.replace(/^(-)?0+(?=\d)/, '');

          // if there is no number, when the input loses focus its value turns 0
          if (!value) {
            element.on('blur', function() {
              element.val('0');
              callHandler();
              element.off('blur');
            });

            // if the value is an empty string don't call the handler function
            return;
          }

          // if the number is greater than the limit number replace the value with the max number
          if (scope.maxNum) {
            if (parseInt(value, 10) > parseInt(scope.maxNum, 10)) {
              value = scope.maxNum;
            }
          }

          element.val(value);

          callHandler();

        });

        // call the handler function
        function callHandler() {
          if (scope.handler) {
            scope.$apply(function() {
              scope.handler({val:parseInt(element.val(),10)});
            });
          }
        }
      }
    };
  });
