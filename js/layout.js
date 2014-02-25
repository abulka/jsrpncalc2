
(function wire_debug_buttons() {
    $('#show_all_layouts').on('click', function(e) { show_all_debug(); });
    $('#tape_toggle').on('click', function(e) { $('td.tape').toggle(); });

    $('#one_col_full_layout').on('click', function(e)   { lmm.go('full', 1); });
    $('#two_col_full_layout').on('click', function(e)   { lmm.go('full', 2); });
    $('#three_col_full_layout').on('click', function(e) { lmm.go('full', 3); });

    $('#one_col_stack_only').on('click', function(e)    { lmm.go('stackonly', 1); });
    $('#two_col_stack_only').on('click', function(e)    { lmm.go('stackonly', 2); });
    $('#three_col_stack_only').on('click', function(e)  { lmm.go('stackonly', 3); });

    $('#one_col_canvas_only').on('click', function(e)   { lmm.go('canvasonly', 1); });
    $('#two_col_canvas_only').on('click', function(e)   { lmm.go('canvasonly', 2); });
    $('#three_col_canvas_only').on('click', function(e) { lmm.go('canvasonly', 3); });

    function show_all_debug() {
        lmm.move_widgets_out();
        $('.container').show();
    }
})();


function layout_mode_mgr() {

    var num_cols;

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

    function go(layout, _num_cols) {
        console.log('go:', layout, _num_cols);
        if (_num_cols == undefined)
            return;
        var $layout = $( '#' + layout + '-' + _num_cols.toString() + 'col');
        move_widgets_out();
        move_widgets_in($layout);
        $('.container').hide();
        $layout.show();
        num_cols = _num_cols;
    }

    function calc_numcols_and_go(layout) {
        var calcwidth = $('#layouts').width();
        console.log('calc_numcols_and_go: width', calcwidth, 'num_cols', num_cols);

        if (calcwidth < 400 && num_cols != 1)
            go(layout, 1);
        else if (calcwidth > 400 && calcwidth < 450 && num_cols != 2)
            go(layout, 2);
        else if (calcwidth > 450 && num_cols != 3)
            go(layout, 3);
    }

    function get_num_cols() { return num_cols; }

    return {
        move_widgets_in:move_widgets_in,
        move_widgets_out:move_widgets_out,
        get_num_cols:get_num_cols,
        go:go,
        calc_numcols_and_go:calc_numcols_and_go
    }
}
var lmm = layout_mode_mgr();


$(window).resize(function(){
    lmm.calc_numcols_and_go(angular.element($('#col_layouts')).scope().viewoptions.layout_mode);
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
        lmm.go($scope.viewoptions.layout_mode, lmm.get_num_cols());
    }, true);

    $scope.$watch('viewoptions.tape_mode', function() {
        console.log('angular watch tape');
        if ($scope.viewoptions.tape_mode)
            $('td.tape').show();
        else
            $('td.tape').hide();
    }, true);
}
