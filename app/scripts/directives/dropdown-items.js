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
  module.directive('acqDropdownItems', function(RepeatParser, $compile) {
    return {
      restrict: 'E',
      scope: false,
      require: '^acqDropdownList',
      replace: true,
      transclude: true,
      templateUrl: './scripts/directives/dropdown-items.html',
      compile: function(tElement, tAttrs) {
        // if (!tAttrs.repeat){
        //   throw "Expected 'repeat' expression.";
        // }

        return function link(scope, element, attrs, $select, transcludeFn) {
          scope.$watch('$select.search', function(newValue) {
            if(newValue && !$select.open && $select.multiple) $select.activate(false, true);
          });
        };
      }
    };
  });
})(angular.module('angularTestApp'));
