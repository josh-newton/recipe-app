'use strict';

angular.module('recipeApp', [
  'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  });
}]);

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

'use strict';

angular.module('recipeApp')
  .directive('recipeSearch', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'scripts/directives/recipe-search/recipe-search.html',
      scope: {
        recipes: '=',
        filteredRecipes: '='
      },
      controller: ["$scope", "$location", "$http", function ($scope, $location, $http) {
      	$scope.searchVal = '';
      	$scope.searchIngredients = [];
        $scope.filteredIngredients = null;
        $scope.$watch('recipes', function(){
          if($scope.recipes.length !== 0){
            $scope.ingredients = $scope.getAllIngredients();
          }
        });

      	$scope.searchChange = function () {
      				// Filter recipes
      				$scope.filteredRecipes = null;
      				var filterValue = [];
      				var searchVals = $scope.searchIngredients;
      				for (var i = 0; i < $scope.recipes.length; i++) {
      					// Need to make uppercase
      					if(searchVals.every(elem => $scope.recipes[i].ingredients.indexOf(elem) !== -1)){
      						filterValue.push($scope.recipes[i]);
      					}
      				}
      				$scope.filteredRecipes = filterValue;

      				// Filter ingredients
      				var foundIngredients = [];
      				var searchVal = $scope.searchVal.toUpperCase();
      				for (var j = 0; j < $scope.ingredients.length; j++) {
      					var ingredient = $scope.ingredients[j].toUpperCase();
      					if(ingredient.indexOf(searchVal) !== -1){
      						foundIngredients.push($scope.ingredients[j]);
      					}
      				}
      				$scope.filteredIngredients = foundIngredients;
        };

      	$scope.addToSearchIngredients = function addToSearchIngredients(ingredient){
      		if($scope.searchIngredients.indexOf(ingredient) === -1){
      			$scope.searchIngredients.push(ingredient);
      		}
      		$scope.searchVal = '';
      		$scope.searchChange();
      		$scope.filteredIngredients = null;
      	};

      	$scope.removeFromSearchIngredients = function removeFromSearchIngredients(index){
      		$scope.searchIngredients.splice(index, 1);
      		$scope.searchChange();
      		$scope.filteredIngredients = null;
      	};

        $scope.resetSearch = function () {
            $scope.searchVal = '';
            $scope.filteredRecipes = $scope.recipes;
      			$scope.filteredIngredients = null;
        };

      	$scope.recipeImg = function recipeImg(src) {
      		if (src === '') {
      			return '../images/default.jpg';
      		} else {
      			return src;
      		}
      	};

      	$scope.goToRecipe = function goToRecipe(recipeTitle) {
      		var index = $scope.recipes.map(function(recipe) { return recipe.title; }).indexOf(recipeTitle);
      		$location.path('recipe/' + index);
      	};

      	$scope.getAllIngredients = function getAllIngredients(){
      		var ingredients = [];
      		for(var i = 0; i < $scope.recipes.length; i++){
      			ingredients = ingredients.concat($scope.recipes[i].ingredients);
      		}
      		ingredients = ingredients.filter(function(elem, index, self) {
          	return index == self.indexOf(elem);
      		});
      		return ingredients;
      	};
      }]
    }
 });
