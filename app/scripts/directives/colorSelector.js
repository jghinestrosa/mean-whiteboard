'use strict';

angular.module('meanWhiteboardApp')
  .directive('colorSelector', ['colorConversionFactory', function (colorConversion) {
    return {
      templateUrl: 'templates/colorSelector.html',
      restrict: 'E',
      replace: true,
      scope: {
        visible: '=',
        initialColor: '='
      },
      controller: function($scope) {
        var rgb,
            hsv;

        $scope.colors = {h: '', s: '', v: '', r: '', g: '', b: '', hex: ''};
        
        $scope.hexToRgb = function(hexVal) {
          rgb = colorConversion.hexToRgb(hexVal);
          $scope.colors.r = rgb.red;
          $scope.colors.g = rgb.green;
          $scope.colors.b = rgb.blue;
        };

        $scope.rgbToHex = function(r, g, b) {
          $scope.colors.hex = colorConversion.rgbToHex(r, g, b);
        };

        $scope.rgbToHsv = function(r, g, b) {
          hsv = colorConversion.rgbToHsv(r, g, b);
          $scope.colors.h = hsv.h;
          $scope.colors.s = hsv.s;
          $scope.colors.v = hsv.v;
        };

        $scope.hsvToRgb = function(h, s, v) {
          rgb = colorConversion.hsvToRgb(h, s, v);
          $scope.colors.r = rgb.red;
          $scope.colors.g = rgb.green;
          $scope.colors.b = rgb.blue;
        };

        $scope.convertFromHex = function(hexVal) {
          $scope.colors.hex = hexVal.slice(1);
          $scope.hexToRgb(hexVal);
          $scope.rgbToHsv(rgb.red, rgb.green, rgb.blue);
        };

        $scope.convertFromHsv = function() {
          $scope.hsvToRgb($scope.colors.h, $scope.colors.s, $scope.colors.v);  
          $scope.rgbToHex($scope.colors.r, $scope.colors.g, $scope.colors.b);
        };

        var setSaturationFromX = function(x) {
          if (x < 0) {
            $scope.colors.s = 0;
          }
          else {
            $scope.colors.s = Math.round(x*100/255);
          }
        };

        var setValueFromY = function(y) {
          if (y < 0) {
            $scope.colors.v = 100;
          }
          else {
            y = 100 - Math.round(y*100/255);
            $scope.colors.v = y;
          }
        };

        $scope.setSaturationValueFromXY = function(x, y) {
          setSaturationFromX(x);
          setValueFromY(y);
          $scope.convertFromHsv();
        };

      },
      link: function postLink(scope, element, attrs) {

        var content = angular.element(element.children()[1]);

        // hue selected
        var hueSelected = angular.element(content.children()[0].querySelector('#hue-selected'));

        // clickable areas
        var selectorClickable = angular.element(content.children()[0].querySelector('.clickable'));
        var hueBarClickable = angular.element(content.children()[1].querySelector('.clickable'));

        // circle cursor
        var circleCursor = angular.element(content.children()[0].querySelector('#circle-cursor'));

        // FIXME: it says the width is an empty string instead of getting the value from the css
        //var radius = parseInt(circleCursor.css('width'), 10)/2;

        var radius = 5;

        // arrows
        var arrows = angular.element(content.children()[1].querySelector('#arrows'));

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
            scope.$apply(scope.setSaturationValueFromXY(x,y));
            //scope.$apply(function() {
              //scope.setSaturationFromX(x);
              //scope.setValueFromY(y);
              //scope.convertFromHsv();
            //});

            selectorClickable.on('mousemove', function(e) {
              console.log('mousemove');
              var x = (e.offsetX || e.layerX) - radius;
              var y = (e.offsetY || e.layerY) - radius;
              setPosition(circleCursor, x, y);
              scope.$apply(scope.setSaturationValueFromXY(x,y));
              //scope.$apply(function() {
                //scope.setSaturationFromX(x);
                //scope.setValueFromY(y);
                //scope.convertFromHsv();
              //});
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
            //scope.hexToRgb(scope.initialColor);
            hueSelected.css('background', scope.initialColor);
            scope.convertFromHex(scope.initialColor);
          }
        });

        // when the color selector is hidden, set scope.visible to false
        scope.$watch(function() {
          return element.css('display');
        },
        function(val) {
          if (val === 'none') {
            scope.visible = false;
          }
        });
      }
    };
  }]);
