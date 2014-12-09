(function(module) {
  'use strict';

  /**
   * @ngdoc directive
   * @name
   * @restrict E
   * @module
   *
   * @description
   * The `` directive.
   */
  module.directive('acqDropdownList', function($document, $compile, $parse) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: './scripts/directives/dropdown-list.html',
      require: ['acqDropdownList', 'ngModel'],
      replace: true,
      transclude: true,
      controller: 'dropdownListCtrl',
      controllerAs: '$select',
      link: function link(scope, element, iAttrs, ctrls, transcludeFn) {
        // console.log(scope.users);
        /*prototypical inheritance*/
        // scope.users[0] = {budgetshare: 1233.86,publisher: 'Alan', rollover: 831201, adjustment: 434, ebudget: 34234};
        // scope.users = [];   // shaded, prototypical inheritance


        var $select = ctrls[0];
        var ngModel = ctrls[1];

        //Set reference to ngModel from dropdownListCtrl
        $select.ngModel = ngModel;

        scope.$watch('$select.selected', function(newValue) {
          if (ngModel.$viewValue !== newValue) {
            ngModel.$setViewValue(newValue);
          }
        });

        ngModel.$render = function() {
          $select.selected = ngModel.$viewValue;
        };

        transcludeFn(scope, function(clone) {
          element.append(clone);
        });

      }

    };
  });
})(angular.module('angularTestApp'));
