'use strict';

angular.module('angularTestApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.tools = [{title:'kaka', content:'lala'},{title:'kaka1', content:'lala1'},{title:'kaka2', content:'lala2'}]

  });
