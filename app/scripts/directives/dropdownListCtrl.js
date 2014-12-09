(function (module) {
  'use strict';
  module.controller('dropdownListCtrl', function ($scope, $element, $timeout, $filter, RepeatParser) {
    var ctrl = this;

    ctrl.items = [];
    ctrl.placeholder = 'lai yi fa';
    ctrl.selected = undefined;

    ctrl.searchEnabled = true;
    ctrl.multiple = false;
    ctrl.open = false;
    ctrl.disabled = undefined; // Initialized inside uiSelect directive link function

    ctrl.isEmpty = function () {
      return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
    };

    ctrl.activate = function () {
      if (!ctrl.disabled && !ctrl.open) {
        ctrl.open = true;
      }
    };

    ctrl.parseRepeatAttr = function (repeatAttr, groupByExp) {
      function updateGroups(items) {
        ctrl.groups = [];
        angular.forEach(items, function (item) {
          var groupFn = $scope.$eval(groupByExp);
          var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
          var group = ctrl.findGroupByName(groupName);
          if (group) {
            group.items.push(item);
          }
          else {
            ctrl.groups.push({name: groupName, items: [item]});
          }
        });
        ctrl.items = [];
        ctrl.groups.forEach(function (group) {
          ctrl.items = ctrl.items.concat(group.items);
        });
      }

      function setPlainItems(items) {
        ctrl.items = items;
      }

      var setItemsFn = groupByExp ? updateGroups : setPlainItems;

      ctrl.parserResult = RepeatParser.parse(repeatAttr);

      ctrl.isGrouped = !!groupByExp;
      ctrl.itemProperty = ctrl.parserResult.itemName;

      // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
      $scope.$watchCollection(ctrl.parserResult.source, function (items) {

        if (items === undefined || items === null) {
          // If the user specifies undefined or null => reset the collection
          // Special case: items can be undefined if the user did not initialized the collection on the scope
          // i.e $scope.addresses = [] is missing
          ctrl.items = [];
        } else {
          if (!angular.isArray(items)) {
            throw "Expected an array but got '{0}'.";
          } else {
            if (ctrl.multiple) {
              //Remove already selected items (ex: while searching)
              var filteredItems = items.filter(function (i) {
                return ctrl.selected.indexOf(i) < 0;
              });
              setItemsFn(filteredItems);
            } else {
              setItemsFn(items);
            }
            ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
          }
        }
      });
    };

    ctrl.setActiveItem = function (item) {
      ctrl.activeIndex = ctrl.items.indexOf(item);
    };

    ctrl.isActive = function (itemScope) {
      if (!ctrl.open) {
        return false;
      }
      var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
      var isActive = itemIndex === ctrl.activeIndex;

      if (!isActive || ( itemIndex < 0 && ctrl.taggingLabel !== false ) || ( itemIndex < 0 && ctrl.taggingLabel === false)) {
        return false;
      }

      if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
        itemScope.$eval(ctrl.onHighlightCallback);
      }

      return isActive;
    };


    // When the user selects an item with ENTER or clicks the dropdown
    ctrl.select = function (item, $event) {
      // debugger;
      var locals = {};
      locals[ctrl.parserResult.itemName] = item;

      //ctrl.onSelectCallback($scope, {
      //  $item: item,
      //  $model: ctrl.parserResult.modelMapper($scope, locals)
      //});

      ctrl.selected = item;

      if (!ctrl.multiple || ctrl.closeOnSelect) {
        ctrl.close();
      }
      if ($event && $event.type === 'click') {
        ctrl.clickTriggeredSelect = true;
      }
    };

    // Closes the dropdown
    ctrl.close = function (skipFocusser) {
      if (!ctrl.open) return;
      // _resetSearchInput();
      ctrl.open = false;
      // if (!ctrl.multiple) {
      //   $timeout(function () {
      //     ctrl.focusser.prop('disabled', false);
      //     if (!skipFocusser) ctrl.focusser[0].focus();
      //   }, 0, false);
      // }
    };

    // Toggle dropdown
    ctrl.toggle = function (e) {
      if (ctrl.open) ctrl.close(); else ctrl.activate();
      e.preventDefault();
      e.stopPropagation();
    };
  });
})(angular.module('angularTestApp'));
