'use strict';

angular.module('meanWhiteboardApp')
  .directive('colorSelector', function () {
    return {
      templateUrl: 'templates/colorSelector.html',
      restrict: 'E',
      replace: true,
      scope: {
        visible: '='
      },
      link: function postLink(scope, element, attrs) {

        // clickable areas
        var selectorClickable = angular.element(element.children()[0].querySelector('.clickable'));
        var hueBarClickable = angular.element(element.children()[1].querySelector('.clickable'));

        // circle cursor
        var circleCursor = angular.element(element.children()[0].querySelector('#circle-cursor'));

        // FIXME: it says the width is an empty string instead of getting the value from the css
        //var radius = parseInt(circleCursor.css('width'), 10)/2;

        var radius = 5;

        // arrows
        var arrows = angular.element(element.children()[1].querySelector('#arrows'));

        // functions to change position of the elements
        var setX = function(element, x) {
          var left = x.toString() + 'px';
          element.css('left', left);
        };

        var setY = function(element, y) {
          var top = y.toString() + 'px';
          element.css('top', top);
        };

        var setPosition = function(element, x, y) {
          setX(element, x);
          setY(element, y);
        };

        // move the circle cursor
        var listenMouseEventsInSelector = function() {
          selectorClickable.on('mousedown', function(e) {

            console.log('mousedown');
            var x = (e.offsetX || e.layerX) - radius;
            var y = (e.offsetY || e.layerY) - radius;
            setPosition(circleCursor, x, y);

            selectorClickable.on('mousemove', function(e) {
              console.log('mousemove');
              var x = (e.offsetX || e.layerX) - radius;
              var y = (e.offsetY || e.layerY) - radius;
              setPosition(circleCursor, x, y);
            });

          });

          selectorClickable.on('mouseup', function() {
            selectorClickable.off('mousemove');
          });
        };

        // move the arrows of the hue bar
        var listenMouseEventsInHueBar = function() {
          hueBarClickable.on('mousedown', function(e) {
            console.log('mousedown');
            var y = e.offsetY || e.layerY;
            setY(arrows, y);

            hueBarClickable.on('mousemove', function(e) {
              console.log('mousemove');
              var y = e.offsetY || e.layerY;
              setY(arrows, y);
            });

          });

          hueBarClickable.on('mouseup', function() {
            hueBarClickable.off('mousemove');
          });
        };

        listenMouseEventsInSelector();
        listenMouseEventsInHueBar();

        // set the color selector visible or not
        scope.$watch('visible', function(newVal) {
          console.log(newVal);
          if (newVal) {
            element.css('display', 'inline-block');
          }
        });
      }
    };
  });
