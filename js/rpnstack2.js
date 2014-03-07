/**
 * Created by Andy on 7/03/14.
 */

myApp.controller('RpnStackController', function ($scope, $rootScope) {
    $scope.stack = [];
    $scope.push = function (val) {
        $scope.stack.push({'val': val, 'type': typeof val});
    }
    $scope.enter = function () {
        $scope.push(Math.random());
        $scope.scroll_to_bottom();
    }
    $scope.drop = function () {
        $scope.stack.pop();
    }
    $scope.dup = function () {
        if ($scope.stack.length == 0)
            return;
        var oldObject = $scope.stack[$scope.stack.length - 1];
        $scope.push(oldObject.val);
        $scope.scroll_to_bottom();
    }
    $scope.swap = function () {
        var list = $scope.stack;
        if (list.length < 2)
            return;
        var bottom_val = list.pop().val;
        var second_bottom_val = list.pop(0).val;
        $scope.push(bottom_val);
        $scope.push(second_bottom_val);
        $scope.scroll_to_bottom();
    },
    $scope.rdn = function () {
        var list = $scope.stack;
        if (list.length < 2)
            return;
        var bottom_val = list.pop().val;
        list.splice(0, 0, {'val': bottom_val, 'type': typeof bottom_val});
    },
    $scope.rup = function () {
        var list = $scope.stack;
        if (list.length < 2)
            return;
        var top_val = list.shift().val;
        $scope.push(top_val);
    },
    $scope.scroll_to_bottom = function() {
        setTimeout(function() {
            var $stackgui = $('#rpnstack2');
            $stackgui.scrollTop(
              $stackgui[0].scrollHeight - $stackgui.height()
            );
        }, 0);
    },

    // init some dummy values
    $scope.push(100);
    $scope.push("welcome to rpn calc");
    $scope.push({1:'a', 2:'b'});
    $scope.push([1, 2, 3, 4, "hi"]);
    $scope.scroll_to_bottom();
});

