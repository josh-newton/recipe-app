'use strict';

angular.module('recipeApp')
  .controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.recipes = [], $scope.filteredRecipes = [];
    $http.get('data/recipes.json').then(function(data){
      $scope.recipes = data.data;
      $scope.filteredRecipes = data.data;
    });
  }
]);
