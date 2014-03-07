/**
 * Created by Andy on 7/03/14.
 */

myApp.controller('RpnStackController', function ($scope, $rootScope) {

    $scope.stack = [ {'name':565, 'type':'int'},
                {'name':201, 'type':'int'},
                {'name':333, 'type':'int'},
                {'name':'qwwewerty', 'type':'string'}];
    $scope.push = function(val) {
        $scope.stack.push({'name':val, 'type': typeof val});
    }
    $scope.enter = function() {
        $scope.push(Math.random());
    }
    $scope.drop = function() {
        $scope.stack.pop(0);
    }

});

