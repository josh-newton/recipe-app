'use strict';

angular.module('recipeApp', [
  'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  $routeProvider.when('/', {
    templateUrl: '../views/main.html',
    controller: 'MainCtrl'
  });
}]);
