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
        var searchInput = element.querySelectorAll('input.ui-select-search');

        //From view --> model
        ngModel.$parsers.unshift(function (inputValue) {
          var locals = {},
              result;
          
          locals = {};
          locals[$select.parserResult.itemName] = inputValue;
          result = $select.parserResult.modelMapper(scope, locals);
          return result;
          
        });

        //From model --> view
        ngModel.$formatters.unshift(function (inputValue) {
          var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
              locals = {},
              result;
          if (data){
            
            var checkFnSingle = function(d){
              locals[$select.parserResult.itemName] = d;
              result = $select.parserResult.modelMapper(scope, locals);
              return result == inputValue;
            };
            //If possible pass same object stored in $select.selected
            if ($select.selected && checkFnSingle($select.selected)) {
              return $select.selected;
            }
            for (var i = data.length - 1; i >= 0; i--) {
              if (checkFnSingle(data[i])) return data[i];
            }
          }
          
          return inputValue;
        });
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

        
        // handle ESC, ENTER key
        element.on('keydown', function(e) {
          console.log('keydown');
          var key = e.which;

          scope.$apply(function() {
            var processed = false;
            if (!processed && $select.items.length > 0) {
              processed = $select.handleDropDownSelection(key);
            }
            // if (processed  && key != KEY.TAB) {
            //   //TODO Check si el tab selecciona aun correctamente
            //   //Crear test
            //   e.preventDefault();
            //   e.stopPropagation();
            // }
          });
        });


        function onDocumentClick(e) {
          var contains = false;

          contains = element[0].contains(e.target);

          if (!contains && !$select.clickTriggeredSelect) {
            $select.close();
            scope.$digest();
          }
          $select.clickTriggeredSelect = false;
        }

        // See Click everywhere but here event http://stackoverflow.com/questions/12931369
        $document.on('click', onDocumentClick);

        scope.$on('$destroy', function() {
          $document.off('click', onDocumentClick);
        });

        transcludeFn(scope, function(clone) {
          // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

          // One day jqLite will be replaced by jQuery and we will be able to write:
          // var transcludedElement = clone.filter('.my-class')
          // instead of creating a hackish DOM element:
          element.append(clone);

          // var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
          // transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
          // //if (transcludedMatch.length !== 1) {
          // //  throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
          // //}
          // element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

          // var transcludedChoices = transcluded.querySelectorAll('.ui-select-choices');
          // transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
          // //if (transcludedChoices.length !== 1) {
          // //  throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
          // //}
          // element.querySelectorAll('.ui-select-choices').replaceWith(transcludedChoices);
        });

      }

    };
  });
})(angular.module('angularTestApp'));
