'use strict';

angular.module('meanWhiteboardApp')
  .directive('listenKeyupHex', function () {
    return {
      restrict: 'A',
      scope: {
        handler: '&listenKeyupHex'
      },
      link: function postLink(scope, element, attrs) {
        var value;
        element.on('keyup', function() {
          element.off('blur');
          value = element.val();

          // if there is no hex value, when the input loses focus its value turns 0
          if (!value) {
            element.on('blur', function() {
              element.val('000000');
              callHandler(value);
              element.off('blur');
            });

            // if the value is an empty string don't call the handler function
            return;
          }

          if (value.length < 6) {
            var diff = 6 - value.length;
            for (var i = 0; i < diff; i++) {
              value = '0' + value;
            }

            element.on('blur', function() {
              element.val(value);
              element.off('blur');
            });
          }

          callHandler(value);
        }); 

        // call the handler function
        function callHandler(value) {
          if (scope.handler) {
            scope.$apply(function() {
              scope.handler({val:value});
            });
          }
        }
      }
    };
  });
