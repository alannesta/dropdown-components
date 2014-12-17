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
  module.directive('acqDropdownSelected', function() {
    return {
      restrict: 'E',
      require: '^acqDropdownList',
      replace: true,
      transclude: true,
      templateUrl: './scripts/directives/dropdown-selected.html',
      link: function(scope, element, attrs, $select) {
        scope.$on('$destroy', function(){
          console.log('dropdown-selected directive scope destroy');
        });

        element.on('$destroy', function(){
          console.log('dropdow-selected directive element destroy');
        });
      } 
    };
  });
})(angular.module('angularTestApp'));
