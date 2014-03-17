/**
 * Created by Andy on 7/03/14.
 */

myApp.controller('RpnStackKeypadController', function ($scope, $rootScope) {
    $scope.push = function () { $scope.$emit('push', 10); }
    $scope.enter = function () { $scope.$emit('enter'); }
    $scope.drop = function () { $scope.$emit('drop'); }
    $scope.dup = function () { $scope.$emit('dup'); }
    $scope.swap = function () { $scope.$emit('swap'); }
    $scope.rdn = function () { $scope.$emit('rdn'); }
    $scope.rup = function () { $scope.$emit('rup'); }
    $scope.increase_visible_stack = function () { $scope.$emit('increase_visible_stack'); }
    $scope.decrease_visible_stack = function () { $scope.$emit('decrease_visible_stack'); }
});

myApp.controller('RpnStackController', function ($scope, $rootScope, rpnstack_dom) {
    $scope.stack = [];
    $scope.stack_height = 8;

    // See also talking between controllers - http://stackoverflow.com/questions/14502006/scope-emit-and-on-angularjs
    $rootScope.$on('push', function(event, val) {
        $scope.push(val);
        rpnstack_dom.scroll_to_bottom();
    });
    $rootScope.$on('enter', function() { $scope.enter(); });
    $rootScope.$on('drop', function() { $scope.drop(); });
    $rootScope.$on('dup', function() { $scope.dup(); });
    $rootScope.$on('swap', function() { $scope.swap(); });
    $rootScope.$on('rdn', function() { $scope.rdn(); });
    $rootScope.$on('rup', function() { $scope.rup(); });
    $rootScope.$on('increase_visible_stack', function() { $scope.increase_visible_stack(); });
    $rootScope.$on('decrease_visible_stack', function() { $scope.decrease_visible_stack(); });

    $scope.push = function (val) {
        $scope.stack.push({'val': val, 'type': typeof val});
    }
    $scope.enter = function () {
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

