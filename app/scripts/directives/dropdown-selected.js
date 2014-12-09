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
        //console.log('$select in MATCH: ');
        //console.log($select);
        $select.lockChoiceExpression = attrs.uiLockChoice;
        // attrs.$observe('placeholder', function(placeholder) {
        //   $select.placeholder = placeholder !== undefined ? placeholder : uiSelectConfig.placeholder;
        // });
        
        $select.allowClear = (angular.isDefined(attrs.allowClear)) ? (attrs.allowClear === '') ? true : (attrs.allowClear.toLowerCase() === 'true') : false;

        // if($select.multiple){
        //   $select.sizeSearchInput();
        // }
      }
    };
  });
})(angular.module('angularTestApp'));
