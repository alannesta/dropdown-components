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
        if (!tAttrs.repeat){
          throw"Expected 'repeat' expression.";
        }

        return function link(scope, element, attrs, $select, transcludeFn) {
          // var repeat = RepeatParser.parse(attrs.repeat);
          var groupByExp = attrs.groupBy;
          if(groupByExp) {
            var groups = element.querySelectorAll('.ui-select-choices-group');
            groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
          }

          $select.parseRepeatAttr(attrs.repeat, groupByExp); //Result ready at $select.parserResult

          var choices = element.querySelectorAll('.acq-dropdown-item-row');

          choices.attr('ng-repeat', RepeatParser.getNgRepeatExpression($select.parserResult.itemName, '$select.items', $select.parserResult.trackByExp, groupByExp))
            .attr('ng-if', '$select.open') //Prevent unnecessary watches when dropdown is closed
            .attr('ng-mouseenter', '$select.setActiveItem('+$select.parserResult.itemName +')')
            .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');

          var rowsInner = element.querySelectorAll('.acq-dropdown-item-row-inner');
          transcludeFn(scope, function(clone){
            rowsInner.append(clone);
          });

          $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from uisTranscludeAppend

          // scope.$watch('$select.search', function(newValue) {
          //   if(newValue && !$select.open && $select.multiple) $select.activate(false, true);
          //   // $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
          //   // $select.refresh(attrs.refresh);
          // });

          // attrs.$observe('refreshDelay', function() {
          //   // $eval() is needed otherwise we get a string instead of a number
          //   var refreshDelay = scope.$eval(attrs.refreshDelay);
          //   $select.refreshDelay = refreshDelay !== undefined ? refreshDelay : uiSelectConfig.refreshDelay;
          // });
        };
      }
    };
  });
})(angular.module('angularTestApp'));
