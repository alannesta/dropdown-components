'use strict';

angular.module('angularTestApp').controller('aboutCtrl', ['$interval','$scope',function($interval, $scope){

	$scope.users = [
      {country: 'Sweden',publisher: 'Cosmik Debris', rollover: 12345, adjustment: 434, ebudget: 34234},
      {country: 'Sweden',publisher: 'Electric Aunt Jemima', rollover: 345, adjustment: 341, ebudget: 1234},
      {country: 'China',publisher: 'Bongo Fury', rollover: 9457, adjustment: 50, ebudget: 8744},
      {country: 'China',publisher: 'Jessica', rollover: 845, adjustment: 984, ebudget: 9334},
      {country: 'China',publisher: 'Acquisio', rollover: 7645, adjustment: 984, ebudget: 9334},
      {country: 'Japan',publisher: 'Judy', rollover: 535, adjustment: 984, ebudget: 9334},
      {country: 'China',publisher: 'Acquisio', rollover: 5645, adjustment: 984, ebudget: 9334},
      {country: 'China',publisher: 'Honda', rollover: 561, adjustment: 984, ebudget: 9334},
      {country: 'Japan',publisher: 'Bar', rollover: 5645, adjustment: 984, ebudget: 9334},
      {country: 'Japan',publisher: 'Foo', rollover: 6235, adjustment: 984, ebudget: 9334},
      {country: 'Canada',publisher: 'Eva', rollover: 57, adjustment: 984, ebudget: 9334},
      {country: 'Canada',publisher: 'Acquisio', rollover: 7695, adjustment: 984, ebudget: 9334}
    ];

    $scope.selection = {
      selected: null
      // selected: $scope.users[2]
    };

    $scope.$watch('selection.selected', function(newVal){
    });

    $scope.remove = function(){
      $('#dropdown').remove();
    }
    // $scope.$watch('users', function(newVal){
    //   console.log('value changed');
    //   console.log(newVal);
    // }, true);

}])