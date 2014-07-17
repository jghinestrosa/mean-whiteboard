'use strict';

angular.module('meanWhiteboardApp')
  .factory('colorConversionFactory', function () {

    // TODO: Check if the parameters are correct values before starting the conversion

    // convert string to int
    var convertToInt = function(val) {
      return parseInt(val, 10);
    };

    var hexToRgb = function(hex) {
      
      // remove '#'
      if (hex[0] === '#') {
        hex = hex.slice(1);
      }

      if (hex.length === 3) {
        return {
          red: parseInt(hex[0], 16),
          green: parseInt(hex[1], 16),
          blue: parseInt(hex[2], 16)
        };
      }

      if (hex.length === 6) {
        return {
          red: parseInt(hex.slice(0,2), 16),
          green: parseInt(hex.slice(2,4), 16),
          blue: parseInt(hex.slice(4,6), 16)
        };
      }
    };

    // Function to convert rgb to hex
    var rgbToHex = function(r, g, b) {
      r = convertToInt(r);
      g = convertToInt(g);
      b = convertToInt(b);

      var redToHex = r.toString(16),
          greenToHex = g.toString(16),
          blueToHex = b.toString(16);

      if (redToHex.length === 1) {
        redToHex = '0' + redToHex;
      }

      if (greenToHex.length === 1) {
        greenToHex = '0' + greenToHex;
      }

      if (blueToHex.length === 1) {
        blueToHex = '0' + blueToHex;
      }

      return redToHex + greenToHex + blueToHex;
    };

    // h [0..359]   s, v [0..100]
    var hsvToRgb = function(h, s, v) {
      h = convertToInt(h);
      s = convertToInt(s);
      v = convertToInt(v);

      var i, f, p, q, t,
          r, g, b;

      // if value = 0, the color is always black
      if (v === 0) {
        return {
          red: 0,
          green: 0,
          blue: 0
        };
      }

      v = v/100;

      if (s === 0) {
        v = Math.floor(v * 255);
        return {
          red: v,
          green: v,
          blue: v
        };
      }

      h = (h*6)/360;
      s = s/100;

      i = Math.floor(h);
      f = h - i;
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - (1 - f) * s);

      switch(i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
      }
      return {
        red: Math.floor(r * 255),
        green: Math.floor(g * 255),
        blue: Math.floor(b * 255)
      };
    };

    var rgbToHsv = function(r, g, b) {
      r = convertToInt(r);
      g = convertToInt(g);
      b = convertToInt(b);

      r = r/255;
      g = g/255;
      b = b/255;

      var max = Math.max(r, g, b),
          min = Math.min(r, g, b);

      var h, s, v; 

      if (max === min) {
        return {
          h: 0,
          s: 0,
          v: max*100,
        };
      }

      var diff = max - min;

      // set hue
      switch (max) {
        case r:
          h = g-b/diff;
          if (g < b) {
            h += 6;
          }
          break;
        case g:
          h = b-r/diff + 2;
          break;
        case b:
          h = r-g/diff + 4;
      }

      h = 360*h/6;
      h = Math.floor(h);

      // set saturation
      if (max === 0) {
        s = 0;
      }
      else {
        s = 1 - min/max;
      }

      s = s*100;
      s = Math.floor(s);

      // set value
      v = max;
      v = v*100;
      v = Math.floor(v);

      return {
        h: h,
        s: s,
        v: v
      };
    };

    return {
      hexToRgb: hexToRgb,
      rgbToHex: rgbToHex,
      hsvToRgb: hsvToRgb,
      rgbToHsv: rgbToHsv
    };
  });
