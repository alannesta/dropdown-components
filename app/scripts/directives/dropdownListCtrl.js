(function (module) {
  'use strict';

  var KEY = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46,
    COMMAND: 91
  };

  module.controller('dropdownListCtrl', function ($scope, $element, $timeout, $filter, RepeatParser) {


    var ctrl = this;
    ctrl.items = [];
    ctrl.unfiltered = [];
    ctrl.placeholder = 'Select';
    ctrl.selected = undefined;
    ctrl.disabled = false;
    ctrl.activeIndex = 0;   // index of currently selected model
    ctrl.searchEnabled = true;
    ctrl.resetSearchInput = true;
    ctrl.searchThreshold = 20;
    ctrl.exceedThreshold = false;

    // ctrl.multiple = false;
    ctrl.open = false;

    var _searchInput = $element.querySelectorAll('input.ui-select-search');
    var threshold = $element.attr('search-threshold') === undefined ? ctrl.searchThreshold : $element.attr('search-threshold');
    console.log(threshold);

    ctrl.isEmpty = function () {
      return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
    };

    ctrl.activate = function () {
      if(ctrl.items.length === 0){
        //TODO: show empty list?
        return;
      }

      if (ctrl.unfiltered.length === 0){
        angular.copy(ctrl.items, ctrl.unfiltered);

        if (ctrl.unfiltered.length > threshold){
          ctrl.exceedThreshold = true;
        }
      }
      if (!ctrl.disabled && !ctrl.open) {
        ctrl.open = true;
        resetSearchInput();
        ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;
      }
      $timeout(function() {
        _searchInput[0].focus();
      });
    };

    function resetSearchInput() {
      // console.log(ctrl.items.length);
      if (ctrl.resetSearchInput) {
        ctrl.search = '';
        //reset activeIndex
        if (ctrl.selected && ctrl.items.length) {
          ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
        }
      }
    }

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
        // console.log('collection changed');
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

    ctrl.findGroupByName = function(name) {
      return ctrl.groups && ctrl.groups.filter(function(group) {
        return group.name === name;
      })[0];
    };

    ctrl.setActiveItem = function (item) {
      // debugger;
      // console.log(ctrl.items.length);
      ctrl.activeIndex = ctrl.items.indexOf(item);
    };


    ctrl.isActive = function (itemScope) {
      if (!ctrl.open) {
        return false;
      }
      // debugger;
      var isActive = false;
      var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
      if (itemIndex !== -1){
        isActive = itemIndex === ctrl.activeIndex;
      }
      return isActive;
    };

    // When the user selects an item with ENTER or clicks the dropdown
    ctrl.select = function (item, $event) {
      ctrl.selected = item;
      ctrl.close();
      
      if ($event && $event.type === 'click') {
        ctrl.clickTriggeredSelect = true;
      }
    };

    // Closes the dropdown
    ctrl.close = function (skipFocusser) {
      if (!ctrl.open){
        return;
      }
      resetSearchInput();
      ctrl.setActiveItem(ctrl.selected);
      ctrl.open = false;
    };

    // Toggle dropdown
    ctrl.toggle = function (e) {
      if (ctrl.open) ctrl.close(); else ctrl.activate();
      e.preventDefault();
      e.stopPropagation();
    };

    // used in dropdown-select link function
    ctrl.handleDropDownSelection = function(key){
      var processed = true;
      switch (key) {
        case KEY.DOWN:
          if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
          else if (ctrl.activeIndex < ctrl.items.length - 1) { ctrl.activeIndex++; }
          break;
        case KEY.UP:
          if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
          else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0)) { ctrl.activeIndex--; }
          break;
        case KEY.TAB:
          if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
          break;
        case KEY.ENTER:
          if(ctrl.open){
            ctrl.select(ctrl.items[ctrl.activeIndex]);
            ctrl.close();
          } else {
            ctrl.activate(false, true); //In case its the search input in 'multiple' mode
          }
          break;
        case KEY.ESC:
          ctrl.close();
          break;
        default:
          processed = false;
      }
      return processed;
    }

    // function _handleDropDownSelection(key) {
    //   var processed = true;
    //   switch (key) {
    //     case KEY.DOWN:
    //       if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
    //       else if (ctrl.activeIndex < ctrl.items.length - 1) { ctrl.activeIndex++; }
    //       break;
    //     case KEY.UP:
    //       if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
    //       else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated)) { ctrl.activeIndex--; }
    //       break;
    //     case KEY.TAB:
    //       if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
    //       break;
    //     case KEY.ENTER:
    //       if(ctrl.open){
    //         ctrl.select(ctrl.items[ctrl.activeIndex]);
    //       } else {
    //         ctrl.activate(false, true); //In case its the search input in 'multiple' mode
    //       }
    //       break;
    //     case KEY.ESC:
    //       ctrl.close();
    //       break;
    //     default:
    //       processed = false;
    //   }
    //   return processed;
    // }

    // _searchInput.on('keydown', function(e) {
    //   console.log('keydown');
    //   var key = e.which;

    //   $scope.$apply(function() {
    //     var processed = false;

    //     if (!processed && ctrl.items.length > 0) {
    //       processed = _handleDropDownSelection(key);
    //     }

    //     if (processed  && key != KEY.TAB) {
    //       //TODO Check si el tab selecciona aun correctamente
    //       //Crear test
    //       e.preventDefault();
    //       e.stopPropagation();
    //     }
    //   });

    //   // if(KEY.isVerticalMovement(key) && ctrl.items.length > 0){
    //   //   _ensureHighlightVisible();
    //   // }
    // });


  });
})(angular.module('angularTestApp'));
