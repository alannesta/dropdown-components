(function (module) {
  'use strict';
  module.controller('dropdownListCtrl', function ($scope, $element, $timeout, $filter, RepeatParser) {
    var ctrl = this;

    ctrl.items = [];
    ctrl.placeholder = '';
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
      ctrl.open = false;
    };

    // Toggle dropdown
    ctrl.toggle = function (e) {
      if (ctrl.open) ctrl.close(); else ctrl.activate();
      e.preventDefault();
      e.stopPropagation();
    };
  });
})(angular.module('angularTestApp'));
