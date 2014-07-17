'use strict';

angular.module('meanWhiteboardApp')
  .directive('onlyPositiveNumbers', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('keypress', function(e) {
          var charCode = e.charCode;
          if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
            return;
          } 

        });
      }
    };
  });
