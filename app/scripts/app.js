'use strict';

angular.module('meanWhiteboardApp', [
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider, $compileProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/whiteboard',
        controller: 'WhiteboardCtrl',
        resolve: {
          canvasFactory: 'canvasFactory',
          buttonFactory: 'buttonFactory'
        }
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data):/);
  });
