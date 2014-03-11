'use strict';

angular.module('meanWhiteboardApp', [
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/whiteboard',
        controller: 'WhiteboardCtrl',
	resolve: {canvasFactory: 'canvasFactory'}
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });
