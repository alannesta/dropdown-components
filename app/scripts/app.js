'use strict';

angular
  .module('angularTestApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about',{
        templateUrl: 'views/about.html',
        controller: 'aboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(['$rootScope', function($rootScope){
    $rootScope.flag = 'I am root';

    if (angular.element.prototype.querySelectorAll === undefined) {
      angular.element.prototype.querySelectorAll = function(selector) {
        return angular.element(this[0].querySelectorAll(selector));
      };
    }
  }]);
