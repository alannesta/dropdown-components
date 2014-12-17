'use strict';

angular.module('angularTestApp').controller('aboutCtrl', ['$interval','$scope',function($interval, $scope){

	$scope.users = [
      {country: 'canada',publisher: 'Cosmik Debris', rollover: 12345, adjustment: 434, ebudget: 34234},
      {country: 'canada',publisher: 'Electric Aunt Jemima', rollover: 345, adjustment: 341, ebudget: 1234},
      {country: 'china',publisher: 'Bongo Fury', rollover: 9457, adjustment: 50, ebudget: 8744},
      {country: 'china',publisher: 'Acquisio', rollover: 5645, adjustment: 984, ebudget: 9334}
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