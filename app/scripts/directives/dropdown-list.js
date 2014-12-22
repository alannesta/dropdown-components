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
      compile: function(){
        // debugger;
        return function link(scope, element, iAttrs, ctrls, transcludeFn) {
        // debugger;
        // console.log(scope.users);
        /*prototypical inheritance*/
        // scope.users[0] = {budgetshare: 1233.86,publisher: 'Alan', rollover: 831201, adjustment: 434, ebudget: 34234};
        // scope.users = [];   // shaded, prototypical inheritance
        var $select = ctrls[0];
        var ngModel = ctrls[1];

        var searchInput = element.querySelectorAll('input.ui-select-search');
        var scrollFlag = false;   // marks if the mouseover event is triggered by the ensureHighlightVisible function call. stopPropagation if so

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

        // element.on('focusin', function(){
        //   console.log('focusin event on dropdown-list')
        // });

        // element.on('mouseover', function(){
        //   console.log('mouseover event bubble mode');
        // });

        element[0].addEventListener('mouseover', function(e){
          console.log('mouseover event capture mode');
          if (scrollFlag){
            e.preventDefault();
            e.stopPropagation();
          }
          scrollFlag = false;
        }, true);
        
        // handle key press
        element.on('keydown', function(e) {
          var key = e.which;
          scope.$apply(function() {
            var processed = false;
            if (!processed && $select.items.length > 0) {
              processed = $select.handleDropDownSelection(key);
            }
            if (processed) {
              //TODO Check si el tab selecciona aun correctamente
              //Crear test
              console.log('processed');
              e.preventDefault();
              e.stopPropagation();
            }
            if((key === 38 || key ===40) && $select.items.length > 0){
              ensureHighlightVisible();
            }
          });
        });

        // reset hightlight if the current selected item is not in the new filtered list
        element.on('keyup', function(e) {
          var key = e.which;
          if (key!==38 && key!== 40){
            scope.$apply(function() {
              var index = $select.items.indexOf($select.selected);
              if (index === -1){
                $select.activeIndex = 0; 
              }else{
                $select.activeIndex = index;
              }
            });
          }
        });

        // when move UP/DOWN, ensure that the dropdown scrolls to keep the current highlighted item in sight
        function ensureHighlightVisible() {
          scrollFlag = true;
          var container = angular.element(element[0].querySelectorAll('.acq-dropdown-item'));
          var choices = angular.element(container[0].querySelectorAll('.acq-dropdown-item-row'));
          // if (choices.length < 1) {
          //   throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
          // }
          // debugger;
          var highlighted = choices[$select.activeIndex];
          var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
          var height = container[0].offsetHeight;

          if (posY > height) {
            container[0].scrollTop += posY - height;
          } else if (posY < highlighted.clientHeight) {
            if ($select.isGrouped && $select.activeIndex === 0){
              container[0].scrollTop = 0; //To make group header visible when going all the way up
            }else{
              container[0].scrollTop -= highlighted.clientHeight - posY;
            }       
          }
        }


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

        element.on('$destroy', function(){

        });

        scope.$on('$destroy', function() {
          $document.off('click', onDocumentClick);
        });

        transcludeFn(scope, function(clone) {
          // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

          // One day jqLite will be replaced by jQuery and we will be able to write:
          // var transcludedElement = clone.filter('.my-class')
          // instead of creating a hackish DOM element:
          // debugger;
          // element.append(clone);
          var transcluded = angular.element('<div>').append(clone);
          var transcludedMatch = transcluded.querySelectorAll('.acq-dropdown-selected');
          
          // transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
          //if (transcludedMatch.length !== 1) {
          //  throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
          //}
          element.querySelectorAll('.acq-dropdown-selected').replaceWith(transcludedMatch);

          var transcludedChoices = transcluded.querySelectorAll('.acq-dropdown-item');
          // transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
          //if (transcludedChoices.length !== 1) {
          //  throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
          //}
          element.querySelectorAll('.acq-dropdown-item').replaceWith(transcludedChoices);
        });
        // debugger;

      }
    }  

    };
  });
})(angular.module('angularTestApp'));
