'use strict';

angular.module('meanWhiteboardApp')
  .directive('colorSelector', ['colorConversionFactory', function (colorConversion) {
    return {
      templateUrl: 'templates/colorSelector.html',
      restrict: 'E',
      replace: true,
      scope: {
        visible: '=',
        initialColor: '=',
        selectColor: '&'
      },
      controller: function($scope) {
        var rgb,
            hsv;

        var circleCursor = {top: '', left: '', radius: 5};
        var arrows = {top: ''};

        $scope.colors = {h: '', s: '', v: '', r: '', g: '', b: '', hex: ''};

        $scope.circleCursor = {top: '', left: '', radius: 5};
        
        $scope.hexToRgb = function(hex) {
          rgb = colorConversion.hexToRgb(hex);
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

        // changes the background color of the clickable area
        $scope.hueBarToHex = function(h) {
          var rgb = colorConversion.hsvToRgb(h, 100, 100);
          return '#' + colorConversion.rgbToHex(rgb.red, rgb.green, rgb.blue);
        };

        $scope.convertFromHex = function(hex) {
          if (hex[0] === '#') {
            hex = hex.slice(1);
          }
          //$scope.colors.hex = hex;
          $scope.hexToRgb(hex);
          $scope.rgbToHsv(rgb.red, rgb.green, rgb.blue);
        };

        $scope.convertFromHsv = function() {
          $scope.hsvToRgb($scope.colors.h, $scope.colors.s, $scope.colors.v);  
          $scope.rgbToHex($scope.colors.r, $scope.colors.g, $scope.colors.b);
        };

        $scope.convertFromRgb = function() {
          $scope.rgbToHsv($scope.colors.r, $scope.colors.g, $scope.colors.b);
          $scope.rgbToHex($scope.colors.r, $scope.colors.g, $scope.colors.b);
        };

        // calculate saturation from x coordinate
        var setSaturationFromX = function(x) {
          if (x < 0) {
            $scope.colors.s = 0;
          }
          else {
            $scope.colors.s = Math.round(x*100/255);
          }
        };

        // calculate value from y coordinate
        var setValueFromY = function(y) {
          if (y < 0) {
            $scope.colors.v = 100;
          }
          else {
            $scope.colors.v = 100 - Math.round(y*100/255);
          }
        };

        // calculate saturation and value from x and y coordinates
        $scope.setSaturationValueFromXY = function(x, y) {
          setSaturationFromX(x);
          setValueFromY(y);
          $scope.convertFromHsv();
        };

        // calculate hue from y coordinate in hue bar
        $scope.setHueFromY = function(y) {
          if (y > 255 || y === 0) {
            $scope.colors.h = 0;
          }
          else {
            y = 255 - y;
            $scope.colors.h = Math.round((y*360)/255);
          }
          $scope.convertFromHsv();
        };

        // generic function to calculate a coordinate using a h, s or v value
        // and the max value (100 for s and v, and 360 for h)
        var convertToCoordinates = function(value, maxValue) {
          return value*255/maxValue;
        };

        // calculate the x coordinate from the s value
        $scope.setXFromSaturation = function(s) {
          circleCursor.left = (convertToCoordinates(s, 100) - circleCursor.radius).toString() + 'px';
          return circleCursor.left;
        };

        // calculate the y coordinate from the v value
        $scope.setYFromValue = function(v) {
          //$scope.circleCursor.top = 255 - convertToCoordinates(v, 100);
          circleCursor.top = ((255 - convertToCoordinates(v, 100)) - circleCursor.radius).toString() + 'px';
          return circleCursor.top;
        };

        $scope.setYFromHue = function(h) {
          //return (255 - convertToCoordinates(h, 360));
          arrows.top = (255 - convertToCoordinates(h, 360)).toString() + 'px';
          return arrows.top;
        };

        // convert from the text inputs
        $scope.convertFromH = function(h) {
          $scope.colors.h = h;
          $scope.convertFromHsv();
        };

        $scope.convertFromS = function(s) {
          $scope.colors.s = s;
          $scope.convertFromHsv();
        };

        $scope.convertFromV = function(v) {
          $scope.colors.v = v;
          $scope.convertFromHsv();
        };

        $scope.convertFromR = function(r) {
          $scope.colors.r = r;
          $scope.convertFromRgb();
        };

        $scope.convertFromG = function(g) {
          $scope.colors.g = g;
          $scope.convertFromRgb();
        };

        $scope.convertFromB = function(b) {
          $scope.colors.b = b;
          $scope.convertFromRgb();
        };

        // update GUI
        $scope.setCircleCursorPosition = function(x, y) {
          circleCursor.left = x.toString() + 'px';
          circleCursor.top = y.toString() + 'px';
        };

        $scope.setArrowsPosition = function(y) {
          arrows.top = y.toString() + 'px';
        };

        $scope.getCircleCursorPosition = function() {
          return {top: circleCursor.top, left: circleCursor.left};
        };

        $scope.getArrowsPosition = function() {
          return {top: arrows.top};
        };

        $scope.getBackgroundColorFromHue = function() {
          return {background: $scope.hueBarToHex(parseInt($scope.colors.h, 10))};
        };

        $scope.updateGUIFromHSV = function() {
          $scope.setYFromHue(parseInt($scope.colors.h, 10));
          $scope.setXFromSaturation(parseInt($scope.colors.s, 10));
          $scope.setYFromValue(parseInt($scope.colors.v, 10));
        };

        $scope.saveColor = function() {
          console.log($scope.colors.hex);
          var color = '#' + $scope.colors.hex;
          $scope.selectColor({color:color});
          $scope.closeSelector();
        };

        $scope.closeSelector = function() {
          $scope.visible = false;
        };

      },
      link: function postLink(scope, element, attrs) {

        //var content = angular.element(element.children()[1]);
        var content = angular.element(element.children()[0]);

        // hue selected
        var hueSelected = angular.element(content.children()[0].querySelector('#hue-selected'));

        // clickable areas
        var selectorClickable = angular.element(content.children()[0].querySelector('.clickable'));
        var hueBarClickable = angular.element(content.children()[1].querySelector('.clickable'));

        //angular.element(content.children()[0].querySelector('.clickable'));

        // FIXME: it says the width is an empty string instead of getting the value from the css
        //var radius = parseInt(circleCursor.css('width'), 10)/2;

        var radius = 5;

        // move the circle cursor
        var listenMouseEventsInSelector = function() {
          
          var handleMouseMove = function(e) {
            e.preventDefault();

            // jQuery support
            if (e.originalEvent) {
              e = e.originalEvent;
            }
            var x = (e.offsetX || e.layerX) - radius;
            var y = (e.offsetY || e.layerY) - radius;
            scope.setCircleCursorPosition(x, y);
            scope.$apply(scope.setSaturationValueFromXY(x,y));
          };

          // Listen events when the mouse is down (mousedown fires touchstart event)
          selectorClickable.on('mousedown', function(e) {
            e.preventDefault();
            
            console.dir(e);
            
            // jQuery support
            if (e.originalEvent) {
              e = e.originalEvent;
            }

            var x = (e.offsetX || e.layerX) - radius;
            var y = (e.offsetY || e.layerY) - radius;
            scope.setCircleCursorPosition(x, y);
            scope.$apply(scope.setSaturationValueFromXY(x,y));

            // Handle mouse (not touch) movement only when the mouse is down
            selectorClickable.on('mousemove', handleMouseMove);
          });

          selectorClickable.on('mouseup mouseleave', function() {
            selectorClickable.off('mousemove');
          });

          /** Touch support **/
          selectorClickable.on('touchmove', handleMouseMove);
        };

        // Move the arrows of the hue bar
        var listenMouseEventsInHueBar = function() {
          
          var handleMouseMove = function(e) {
            e.preventDefault();

            // jQuery support
            if (e.originalEvent) {
              e = e.originalEvent;
            }

            var y = e.offsetY || e.layerY;
            scope.setArrowsPosition(y);
            scope.$apply(scope.setHueFromY(y));
          };

          // Listen events when the mouse is down (mousedown fires touchstart event)
          hueBarClickable.on('mousedown', function(e) {
            // jQuery support
            if (e.originalEvent) {
              e = e.originalEvent;
            }

            var y = e.offsetY || e.layerY;
            scope.setArrowsPosition(y);
            scope.$apply(scope.setHueFromY(y));

            hueBarClickable.on('mousemove', handleMouseMove);

          });

          hueBarClickable.on('mouseup mouseleave', function() {
            hueBarClickable.off('mousemove');
          });

          /** Touch support **/
          hueBarClickable.on('touchmove', handleMouseMove);
        };

        listenMouseEventsInSelector();
        listenMouseEventsInHueBar();

        // Set the color selector visible or not
        scope.$watch('visible', function(newVal) {
          if (newVal) {
            element.css('display', 'inline-block');
            scope.colors.hex = scope.initialColor.slice(1);
            scope.convertFromHex(scope.colors.hex);
            hueSelected.css('background', scope.hueBarToHex(scope.colors.h));
            scope.setXFromSaturation(scope.colors.s);
            scope.setYFromValue(scope.colors.v);
            scope.setYFromHue(scope.colors.h);
          }
          else {
            element.css('display', 'none');
          }
        });
      }
    };
  }]);
