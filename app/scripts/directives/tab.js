'use strict';

angular.module('meanWhiteboardApp')
  .directive('tab', function () {
    return {
      restrict: 'A',
      scope: {
        visible: '=tab'
      },
      link: function postLink(scope, element, attrs) {

        var tabWrapperId = attrs.tabWrapper;
        var tabId = attrs.tabElement;
        var elementWidth;
        var elementHeight;

        if (tabWrapperId && tabId) {
          element = angular.element('#' + tabWrapperId);
          var tab = angular.element('#' + tabId);

          elementWidth = element.outerWidth() - tab.outerWidth();
          elementHeight = element.outerHeight() - tab.outerHeight() - 5; // TODO: Fix this hack for chat box tab
        }
        else {
          elementWidth = element.outerWidth();
          elementHeight = element.outerHeight();
        }

        var tabSide = attrs.tabSide;

        //console.log('tabWrapper: ', attrs.tabWrapper);

        console.log('width: ' + elementWidth);

        var closeTab = function() {
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

        var openTab = function() {
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
            openTab();
          }
          else {
            closeTab();
          }
        });

        // The initial state is closed
        //closeTab();
        element.css({'display': 'inline-block'});

        // Hack for showing the tab without initial transition
        setTimeout(function() {
          element.addClass('tab');
        }, 50);
      }
    };
  });
