'use strict';

angular.module('meanWhiteboardApp')
  .directive('tab', function () {
    return {
      restrict: 'A',
      scope: {
        visible: '=tab'
      },
      link: function postLink(scope, element, attrs) {

        var elementWidth = element.width();
        var elementHeight = element.height();
        var tabSide = attrs.tabSide;

        var hide = function() {
          if (tabSide === 'left') {
            element.css({'margin-left': -elementWidth});
          }
          else if (tabSide === 'right') {
            element.css({'margin-right': -elementWidth});
          }
          else if (tabSide === 'top') {
            element.css({'margin-top': -elementHeight});
          }
          else {
            element.css({'margin-bottom': -elementHeight});
          }
        };

        var show = function() {
          if (tabSide === 'left') {
            element.css({'margin-left': '0px'});
          }
          else if (tabSide === 'right') {
            element.css({'margin-right': '0px'});
          }
          else if (tabSide === 'top') {
            element.css({'margin-top': '0px'});
          }
          else {
            element.css({'margin-bottom': '0px'});
          }
        };

        scope.$watch('visible', function(visible) {
          if (visible) {
            show();
          }
          else {
            hide();
          }
        });

        // The initial state is hidden
        hide();
      }
    };
  });
