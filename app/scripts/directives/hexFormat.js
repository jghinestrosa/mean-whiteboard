'use strict';

angular.module('meanWhiteboardApp')
  .directive('hexFormat', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('keypress', function(e) {
          var charCode = e.charCode;
          if (charCode > 31) {
            // numbers
            if (charCode >= 48 && charCode <= 57) {
              return;
            }

            // uppercase letters
            if (charCode >= 65 && charCode <= 70) {
              return;
            }

            // lowercase letters
            if (charCode >= 97 && charCode <= 102) {
              return;
            }

            e.preventDefault();
          } 
        });
      }
    };
  });
