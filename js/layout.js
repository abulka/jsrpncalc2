
function layout_mode_mgr() {

    function move_widgets_in($target) {
        $target.find('.stack').html($('#stack'));
        $target.find('.cmd').html($('#cmd'));
        $target.find('.keypad').html($('#keypad'));
        $target.find('.canvas').html($('#canvas'));
        $target.find('.custom').html($('#custom'));
    }

    function move_widgets_out() {
        $('#holding_area').after($('#stack'));
        $('#holding_area').after($('#cmd'));
        $('#holding_area').after($('#keypad'));
        $('#holding_area').after($('#canvas'));
        $('#holding_area').after($('#custom'));
        repair_layout_placeholder_texts();
    }

    function repair_layout_placeholder_texts() {
        $('div.stack').html('** stack **');
        $('div.cmd').html('** cmd **');
        $('div.keypad').html('** keypad **');
        $('div.canvas').html('** canvas **');
        $('div.custom').html('** custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom **');
    }

    function achieve_layout(num_cols, layout_mode) {
//        var layout_mode = $scope.viewoptions.layout_mode;
//        var num_cols = $scope.viewoptions.num_cols;
        console.log('achieve_layout', layout_mode, num_cols);
        if (num_cols == undefined) {
            console.log('skipping WATCH cos num_cols is undefined')
            return;
        }
        var $layout = $( '#' + layout_mode + '-' + num_cols.toString() + 'col');
        move_widgets_out();
        move_widgets_in($layout);
        $('.container').hide();
        $layout.show();
    }

    function achieve_tape(show_tape) {
        if (show_tape)
            $('td.tape').show();
        else
            $('td.tape').hide();
    }

    return {
        move_widgets_in:move_widgets_in,
        move_widgets_out:move_widgets_out,
        achieve_layout:achieve_layout,
        achieve_tape:achieve_tape
    }
}
var lmm = layout_mode_mgr();


$(window).resize(function(){
    var scope = angular.element($('#col_layouts')).scope();

    scope.$apply(scope.on_resize());  // need apply so that events trigger

    // experiment with sending an event on the controller from outside
    scope.$broadcast('handleBroadcast', 'resize happened');

    // what about calling a method?
    scope.sayhello();
});

var myApp = angular.module('myApp',[]);

myApp.controller('ViewOptionsController', function($scope, $rootScope, userRepository, logger123) {
//function ViewOptionsController($scope) {

    $scope.show_debug = false;
    tape_mode: false,           // true, false
    $scope.viewoptions = {
        layout_mode: "full",    // full, stackonly, canvasonly
        num_cols: 1             // 1,2,3
    };

    // Convenience method to set both vars at the same time.  An alternative is to set both
    // properties individually.
    $scope.go = function(layout_mode, num_cols) {
        console.log('go called, vars set to: layout_mode=', layout_mode, 'num_cols=', num_cols);
        $scope.viewoptions.layout_mode = layout_mode;
        $scope.viewoptions.num_cols = num_cols;
    }

    // When watching the parent viewoptions I can change two model states at once
    // and only get one watch event - good.  The true parameter means watch recursively inside the viewoptions model
    $scope.$watch('viewoptions', function() {
        console.log('$watch viewoptions');
        lmm.achieve_layout($scope.viewoptions.num_cols, $scope.viewoptions.layout_mode);
    }, true);

    // Called by the resize event and also from the dom loaded event
    // Important: In those cases need to wrap those calls within an $apply() to get angular
    // to recheck bindings etc since we are calling from a different 'turn' - see http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
    $scope.on_resize = function() {
        var layout_mode = $scope.viewoptions.layout_mode;
        var num_cols = $scope.viewoptions.num_cols;

        var calcwidth = $('#layouts').width();
        console.log('on_resize: width', calcwidth, ' currently layout_mode=', layout_mode, 'num_cols=', num_cols);
//        console.log("$(document).width()", $(document).width());

        if (calcwidth < 400 && num_cols != 1)
            $scope.go(layout_mode, 1);
        else if (calcwidth > 400 && calcwidth < 450 && num_cols != 2)
            $scope.go(layout_mode, 2);
        else if (calcwidth > 450 && num_cols != 3)
            $scope.go(layout_mode, 3);
    }

    // Need to move tape mode out of viewoptions
    // also the functionality should be injected external too
    $scope.$watch('tape_mode', function() {
        console.log('angular watch tape');
        lmm.achieve_tape($scope.tape_mode);

        // Exercise calling some services - for no reason
//        console.log(userRepository.getAllUsers());
//        logger123.logmsg('calling service ok');
//        $rootScope.$broadcast('handleBroadcast', $scope.show_debug);
    }, true);

    $scope.$on('handleBroadcast', function(event, info) {
//        console.log('got message', info);
    });

    $scope.sayhello = function() {
        //$scope.tvhours = 0;
//        console.log('hello');
    }
//}
});

myApp.factory('userRepository', function() {
    return {
        getAllUsers: function() {
           return [
              { firstName: 'Jane', lastName: 'Doe', age: 29 },
              { firstName: 'John', lastName: 'Doe', age: 32 }
           ];
        }
     }
 });

myApp.factory('logger123', function() {
    return {
        logmsg: function(msg) {
           console.log(msg);
        }
     }
 });



(function wire_debug_buttons() {

    $('#show_all_layouts').on('click', function(e) { show_all_debug(); });

    function show_all_debug() {
        lmm.move_widgets_out();
        $('.container').show();
    }
})();

