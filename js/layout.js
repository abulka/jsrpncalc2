
(function wire_debug_buttons() {
    $('#show_all_layouts').on('click', function(e) { show_all_debug(); });
    $('#tape_toggle').on('click', function(e) { $('td.tape').toggle(); });

    $('#one_col_full_layout').on('click', function(e) { lmm.go_one_col_full(); });
    $('#two_col_full_layout').on('click', function(e) { lmm.go_two_col_full(); });
    $('#three_col_full_layout').on('click', function(e) { lmm.go_three_col_full(); });

    $('#one_col_stack_only').on('click', function(e) { lmm.go_one_col_stack_only(); });
    $('#two_col_stack_only').on('click', function(e) { lmm.go_two_col_stack_only(); });
    $('#three_col_stack_only').on('click', function(e) { lmm.go_three_col_stack_only(); });

    $('#one_col_canvas_only').on('click', function(e) { lmm.go_one_col_canvas_only(); });
    $('#two_col_canvas_only').on('click', function(e) { lmm.go_two_col_canvas_only(); });
    $('#three_col_canvas_only').on('click', function(e) { lmm.go_three_col_canvas_only(); });

    function show_all_debug() {
        lmm.move_widgets_out();
        $('#one-col-full').show();
        $('#one-col-stackonly').show();
        $('#one-col-canvasonly').show();
        $('#two-col-full').show();
        $('#two-col-stackonly').show();
        $('#two-col-canvasonly').show();
        $('#three-col-full').show();
        $('#three-col-stackonly').show();
        $('#three-col-canvasonly').show();
    }

})();


function layout_mode_mgr() {

    var col_mode;

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

//    function three_col_match_col1() {
//        console.log($('#three-col-full .col1').height());
//        $('#three-col-full .col2').height($('#three-col-full .col1').height());
//        $('#three-col-full .canvas').toggleClass('canvas100');
//
//        console.log($('#three-col-full .col1').height());
//    }

    // Go function - these are the high level functions
    // layout parameter is 'full', 'stackonly', 'canvasonly'

    function go(layout, num_cols) {
        console.log('switch_mode', layout, num_cols);
        var $layout = $( '#' + layout + '-' + num_cols.toString() + 'col');
        move_widgets_out();
        move_widgets_in($layout);
        $('.container').hide();
        $layout.show();
        col_mode = num_cols;
    }

    function go_one_col_full() {            go('full', 1); }
    function go_one_col_stack_only() {      go('stackonly', 1); }
    function go_one_col_canvas_only() {     go('canvasonly', 1); }
    function go_two_col_full() {            go('full', 2); }
    function go_two_col_stack_only() {      go('stackonly', 2); }
    function go_two_col_canvas_only() {     go('canvasonly', 2); }
    function go_three_col_full() {          go('full', 3); }
    function go_three_col_stack_only() {    go('stackonly', 3); }
    function go_three_col_canvas_only() {   go('canvasonly', 3); }

    function get_col_mode() { return col_mode/*.toString() + 'col'*/; }

    return {
        move_widgets_in:move_widgets_in,
        move_widgets_out:move_widgets_out,
        go_one_col_full:go_one_col_full,
        go_one_col_stack_only:go_one_col_stack_only,
        go_one_col_canvas_only:go_one_col_canvas_only,
        go_two_col_full:go_two_col_full,
        go_two_col_stack_only:go_two_col_stack_only,
        go_two_col_canvas_only:go_two_col_canvas_only,
        go_three_col_full:go_three_col_full,
        go_three_col_stack_only:go_three_col_stack_only,
        go_three_col_canvas_only:go_three_col_canvas_only,
        get_col_mode:get_col_mode,
        go:go
    }
}
var lmm = layout_mode_mgr();


$(window).resize(function(){
    var calcwidth = $('#layouts').width();
    var curr_layout_mode = angular.element($('#col_layouts')).scope().viewoptions.layout_mode;

    if (calcwidth < 400 && lmm.get_col_mode() != 1)
        lmm.go(curr_layout_mode, 1);
    else if (calcwidth > 400 && calcwidth < 450 && lmm.get_col_mode() != 2)
        lmm.go(curr_layout_mode, 2);
    else if (calcwidth > 500 && calcwidth < 600 && lmm.get_col_mode() != 3)
        lmm.go(curr_layout_mode, 3);
});

function ViewOptionsController($scope) {
    /*
    This is a controller for the view options GUI radio buttons and checkbox
    The reason col_mode is not here is that this is not an explicit option in
        the GUI and is implicitly set via the window resize/width changes.
     */
    $scope.show_debug = false;
    $scope.viewoptions = {
        tape_mode: false,       // true, false
        layout_mode: "full"     // full, stackonly, canvasonly
    };

    $scope.$watch('viewoptions.layout_mode', function() {
        console.log('angular watch');
        lmm.go($scope.viewoptions.layout_mode, lmm.get_col_mode());
    }, true);

    $scope.$watch('viewoptions.tape_mode', function() {
        console.log('angular watch tape');
        if ($scope.viewoptions.tape_mode)
            $('td.tape').show();
        else
            $('td.tape').hide();
    }, true);
}

/*
MUSINGS

Could we have an angular controller also involved in the col_mode/layout gui?
A controller with a
    $scope.layout_col_mode
    $scope.one_col_layout_mode
    $scope.two_col_layout_mode
    $scope.three_col_layout_mode
and a set of functions for switching modes.
I already kind of have this in my existing "revealing module pattern" based classes.
So why switch to an angular approach for those?
Probably there is no point as its not wired to any GUI user control.
But there may be some nice elegance about it perhaps.
    Custom Event notification?
    More standardised way of organising my code?

Currently have
    lmm
    decider - depends on lmm
also
    resize function - depends on decider and angular viewoptions.layout_mode
    angular ViewOptionsController - depends on decider, models show_debug and viewoptions.*
 */
