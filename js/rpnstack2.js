/**
 * Created by Andy on 7/03/14.
 */

myApp.controller('RpnStackController', function ($scope, $rootScope) {

    $scope.stack = [
                {'val':565, 'type':'int'},
                {'val':333, 'type':'int'},
                {'val':'qwwewerty', 'type':'string'}];
    $scope.push = function(val) {
        $scope.stack.push({'val':val, 'type': typeof val});
    }
    $scope.enter = function() {
        $scope.push(Math.random());
    }
    $scope.drop = function() {
        $scope.stack.pop(0);
    }
    $scope.dup = function () {
      if ($scope.stack.length == 0)
        return;
      var oldObject = $scope.stack[$scope.stack.length-1];
      $scope.push(oldObject.val);
      //this.scroll_to_bottom();
    }

    $scope.push([1,2,3,4,"hi"]);
});

