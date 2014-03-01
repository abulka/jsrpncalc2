


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

    return {
        move_widgets_in:move_widgets_in,
        move_widgets_out:move_widgets_out,
    }
}
var lmm = layout_mode_mgr();


$(window).resize(function(){
    var scope = angular.element($('#col_layouts')).scope();

    scope.calc_numcols_and_go();

    // experiment with sending an event on the controller from outside
    scope.$broadcast('handleBroadcast', 'resize happened');

    // what about calling a method?
    scope.sayhello();
});

var myApp = angular.module('myApp',[]);

myApp.controller('ViewOptionsController', function($scope, $rootScope, userRepository, logger123) {
//function ViewOptionsController($scope) {
    /*
    This is a controller for the view options GUI radio buttons and checkbox
    The reason col_mode is not here is that this is not an explicit option in
        the GUI and is implicitly set via the window resize/width changes.
     */
    $scope.show_debug = false;
    $scope.viewoptions = {
        tape_mode: false,       // true, false
        layout_mode: "full",    // full, stackonly, canvasonly
        num_cols: undefined      // 1,2,3
    };

    $scope.calc_numcols_and_go = function() {
        var layout = $scope.viewoptions.layout_mode;
        var num_cols = $scope.viewoptions.num_cols;

        var calcwidth = $('#layouts').width();
        console.log('calc_numcols_and_go: width', calcwidth, 'num_cols', num_cols);
//        console.log("$(document).width()", $(document).width());

        if (calcwidth < 400 && num_cols != 1)
            $scope.go(layout, 1);
        else if (calcwidth > 400 && calcwidth < 450 && num_cols != 2)
            $scope.go(layout, 2);
        else if (calcwidth > 450 && num_cols != 3)
            $scope.go(layout, 3);
    }

    $scope.go = function(layout, _num_cols) {
        console.log('go:', layout, _num_cols);
        if (_num_cols == undefined)
            return;
        var $layout = $( '#' + layout + '-' + _num_cols.toString() + 'col');
        lmm.move_widgets_out();
        lmm.move_widgets_in($layout);
        $('.container').hide();
        $layout.show();
        $scope.viewoptions.num_cols = _num_cols;
    }

    $scope.$watch('viewoptions.layout_mode', function() {
        console.log('angular watch');
        $scope.go($scope.viewoptions.layout_mode, $scope.viewoptions.num_cols);
    }, true);

    $scope.$watch('viewoptions.num_cols', function() {
        console.log('angular watch');
        $scope.go($scope.viewoptions.layout_mode, $scope.viewoptions.num_cols);
    }, true);

    $scope.$watch('viewoptions.tape_mode', function() {
        console.log('angular watch tape');
        if ($scope.viewoptions.tape_mode)
            $('td.tape').show();
        else
            $('td.tape').hide();

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
//    var scope = angular.element($('#col_layouts')).scope();

    $('#show_all_layouts').on('click', function(e) { show_all_debug(); });
//    $('#tape_toggle').on('click', function(e) { $('td.tape').toggle(); });

//    $('#one_col_full_layout').on('click', function(e)   { scope.go('full', 1); });
//    $('#two_col_full_layout').on('click', function(e)   { scope.go('full', 2); });
//    $('#three_col_full_layout').on('click', function(e) { scope.go('full', 3); });
//
//    $('#one_col_stack_only').on('click', function(e)    { scope.go('stackonly', 1); });
//    $('#two_col_stack_only').on('click', function(e)    { scope.go('stackonly', 2); });
//    $('#three_col_stack_only').on('click', function(e)  { scope.go('stackonly', 3); });
//
//    $('#one_col_canvas_only').on('click', function(e)   { scope.go('canvasonly', 1); });
//    $('#two_col_canvas_only').on('click', function(e)   { scope.go('canvasonly', 2); });
//    $('#three_col_canvas_only').on('click', function(e) { scope.go('canvasonly', 3); });

    function show_all_debug() {
        lmm.move_widgets_out();
        $('.container').show();
    }
})();

