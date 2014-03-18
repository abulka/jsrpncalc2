/**
 * Created by Andy on 7/03/14.
 */

myApp.controller('RpnStackManipulation', function ($scope, $rootScope) {
    // This controller just redirects commands to the main rpn stack controller
    //
    // The only way we can send messages between sibling controllers is via $rootScope.$broadcast
    // (well we could find the other controller's scope via
    //     var scope = angular.element($('#stack')).scope();
    // and call methods directly, but that would probably be a bit nasty).
    //
    // Oh and by the way, we need two controllers because the stack and popup keypad are different divs
    //     and we can't have the same controller on two divs.

    $scope.push = function (n) { $rootScope.$broadcast('push', n); }
    $scope.random_num = function () { $rootScope.$broadcast('random_num'); }
    $scope.drop = function () { $rootScope.$broadcast('drop'); }
    $scope.dup = function () { $rootScope.$broadcast('dup'); }
    $scope.swap = function () { $rootScope.$broadcast('swap'); }
    $scope.rdn = function () { $rootScope.$broadcast('rdn'); }
    $scope.rup = function () { $rootScope.$broadcast('rup'); }
    $scope.increase_visible_stack = function () { $rootScope.$broadcast('increase_visible_stack'); }
    $scope.decrease_visible_stack = function () { $rootScope.$broadcast('decrease_visible_stack'); }
});

myApp.controller('RpnStackController', function ($scope, $rootScope, rpnstack_dom) {
    $scope.stack = [];
    $scope.stack_height = 8;

    // See talking between controllers - http://stackoverflow.com/questions/14502006/scope-emit-and-on-angularjs
    // Basically: 
    //  - emit sends even upwards to parent controllers, 
    //  - broadcast sends down to child controllers
    //  - and best trick is to broadcast on $rootScope to send down to all controllers no matter where.

    // Event support
    $scope.$on('push', function(event, val) { $scope.push(val); });
    $scope.$on('drop', function() { $scope.drop(); });
    $scope.$on('random_num', function() { $scope.random_num(); });
    $scope.$on('dup', function() { $scope.dup(); });
    $scope.$on('swap', function() { $scope.swap(); });
    $scope.$on('rdn', function() { $scope.rdn(); });
    $scope.$on('rup', function() { $scope.rup(); });
    $scope.$on('increase_visible_stack', function() { $scope.increase_visible_stack(); });
    $scope.$on('decrease_visible_stack', function() { $scope.decrease_visible_stack(); });

    // Actual functionality
    $scope.push = function (val) {
        console.log('push', val);
        $scope.stack.push({'val': val, 'type': typeof val});
        rpnstack_dom.scroll_to_bottom();
    }
    $scope.random_num = function () {
        $scope.push(Math.random());
        rpnstack_dom.scroll_to_bottom();
    }
    $scope.drop = function () {
        $scope.stack.pop();
    }
    $scope.dup = function () {
        if ($scope.stack.length == 0)
            return;
        var oldObject = $scope.stack[$scope.stack.length - 1];
        $scope.push(oldObject.val);
        rpnstack_dom.scroll_to_bottom();
    }
    $scope.swap = function () {
        var list = $scope.stack;
        if (list.length < 2)
            return;
        var bottom_val = list.pop().val;
        var second_bottom_val = list.pop(0).val;
        $scope.push(bottom_val);
        $scope.push(second_bottom_val);
        rpnstack_dom.scroll_to_bottom();
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
    $scope.clear = function () {
        $scope.stack = [];
    },

    $scope.increase_visible_stack = function () {
        $scope.stack_height += 1;
    },
    $scope.decrease_visible_stack = function () {
        $scope.stack_height -= 1;
    },
    $scope.$watch('stack_height', function (val, old) {
        $scope.stack_height = parseInt(val);  // correct the slider string setting back to a number.  Thankfully the watch doesn't retrigger.
        rpnstack_dom.set_stack_height($scope.stack_height);
    }, true);


    // init some dummy values
    $scope.push(100);
    $scope.push("welcome to rpn calc");
    $scope.push({1: 'a', 2: 'b'});
    $scope.push([1, 2, 3, 4, "hi"]);
            rpnstack_dom.scroll_to_bottom();
});

myApp.factory('rpnstack_dom', function () {
    function scroll_to_bottom() {
        setTimeout(function() {
            var $stackgui = $('#stack');
            $stackgui.scrollTop(
              $stackgui[0].scrollHeight - $stackgui.height()
            );
        }, 0);
    }

    function set_stack_height(n) {
        var new_height = (n+0.75).toString()+'em';
        $('#stack').height(new_height);
    }

    return {
        scroll_to_bottom: scroll_to_bottom,
        set_stack_height: set_stack_height
    }
});

