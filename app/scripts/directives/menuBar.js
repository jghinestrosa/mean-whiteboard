'use strict';

angular.module('meanWhiteboardApp')
  .directive('menuBar', function () {
    return {
      templateUrl: 'templates/menuBar.html',
      replace: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var closeButton = angular.element(element.children()[0]);
        closeButton.on('click', function() {
          scope.$apply(function() {
            element.parent().css('display', 'none');
          });
        });

      }
    };
  });
