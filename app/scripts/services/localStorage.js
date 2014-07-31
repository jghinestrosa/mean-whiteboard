'use strict';

angular.module('meanWhiteboardApp')
  .factory('localStorageFactory', ['$window', function ($window) {

    var localStorage;

    // Check if localStorage is available
    var hasLocalStorage = (function() {
      if ($window.localStorage && $window.localStorage !== null) {
        localStorage = $window.localStorage;
        return true;
      }

      return false;
    }());

    // Save something in the localStorage
    var save = function(obj) {
      if (hasLocalStorage) {
        obj = obj || {};

        if (obj !== {}) {
          localStorage.setItem(obj.key, JSON.stringify(obj.val));
          return true;
        }
      }

      return false;
    };

    // Get something from the localStorage using the key
    var get = function(key) {
      if (hasLocalStorage) {
        return JSON.parse(localStorage.getItem(key));
      }
    };

    // Delete something from the localStorage
    var remove = function(key) {
      if (hasLocalStorage) {
        localStorage.removeItem(key);
        
        if (!localStorage.getItem(key)) {
          return true;
        }
      }

      return false;
    };

    return {
      save: save,
      get: get,
      remove: remove
    };
    
  }]);
