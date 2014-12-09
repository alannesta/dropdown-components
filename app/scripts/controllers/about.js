'use strict';

angular.module('angularTestApp').controller('aboutCtrl', ['$interval','$scope',function($interval, $scope){

	$scope.users = [
      {budgetshare: 1233.86,publisher: 'Cosmik Debris', rollover: 12345, adjustment: 434, ebudget: 34234},
      {budgetshare: 633.86,publisher: 'Electric Aunt Jemima', rollover: 345, adjustment: 341, ebudget: 1234},
      {budgetshare: 33.86,publisher: 'Bongo Fury', rollover: 9457, adjustment: 50, ebudget: 8744},
      {budgetshare: 823.86,publisher: 'Acquisio', rollover: 5645, adjustment: 984, ebudget: 9334}
    ];

    $scope.selection = {
      selected: null
    };

    $scope.test = 'yeehaw';

    $scope.$watch('selection.selected', function(newVal){
    	console.log('value changed');
    	console.log(newVal);
    });

    // $scope.$watch('test', function(newVal){
    //   console.log('value changed');
    //   console.log(newVal);
    // });

    // $scope.$watch('users', function(newVal){
    //   console.log('value changed');
    //   console.log(newVal);
    // }, true);

}])