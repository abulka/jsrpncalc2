
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


var col_mode;

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
        $('div.stack').html('_stack');
        $('div.cmd').html('_cmd');
        $('div.keypad').html('_keypad');
        $('div.canvas').html('_canvas');
        $('div.custom').html('_custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom');
    }

    function three_col_match_col1() {
        console.log($('#three-col-full .col1').height());
        $('#three-col-full .col2').height($('#three-col-full .col1').height());
        $('#three-col-full .canvas').toggleClass('canvas100');

        console.log($('#three-col-full .col1').height());
    }

    // Go functions - these are the high level functions

    function go($layout, _col_mode) {
        move_widgets_out();
        move_widgets_in($layout);
        $('.container').hide();
        $layout.show();
        col_mode = _col_mode;
    }
    function go_one_col_full() { go($('#one-col-full'), "1col");  }
    function go_one_col_stack_only() { go($('#one-col-stackonly'), "1col"); }
    function go_one_col_canvas_only() { go($('#one-col-canvasonly'), "1col"); }
    function go_two_col_full() { go($('#two-col-full'), "2col"); }
    function go_two_col_stack_only() { go($('#two-col-stackonly'), "2col"); }
    function go_two_col_canvas_only() { go($('#two-col-canvasonly'), "2col"); }
    function go_three_col_full() { go($('#three-col-full'), "3col"); }
    function go_three_col_stack_only() { go($('#three-col-stackonly'), "3col"); }
    function go_three_col_canvas_only() { go($('#three-col-canvasonly'), "3col"); }

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
        go_three_col_canvas_only:go_three_col_canvas_only
    }
}
var lmm = layout_mode_mgr();


function LayoutDecider() {

    function notify_width_change(calcwidth, layout_mode) {
        if (calcwidth < 400 && col_mode != "1col")
            switch_mode(layout_mode, "1col");
        else if (calcwidth > 400 && calcwidth < 450 && col_mode != "2col")
            switch_mode(layout_mode, "2col");
        else if (calcwidth > 500 && calcwidth < 600 && col_mode != "3col")
            switch_mode(layout_mode, "3col");
    }

    function switch_mode(layout_mode, new_col_mode) {
        console.log('switch_mode', layout_mode, new_col_mode);
        switch (layout_mode) {
            case 'full':
                switch (new_col_mode) {
                    case '1col':
                        lmm.go_one_col_full();
                        break;
                    case '2col':
                        lmm.go_two_col_full();
                        break;
                    case '3col':
                        lmm.go_three_col_full();
                        break;
                }
                break;
            case 'stack_only':
                switch (new_col_mode) {
                    case '1col':
                        lmm.go_one_col_stack_only();
                        break;
                    case '2col':
                        lmm.go_two_col_stack_only();
                        break;
                    case '3col':
                        lmm.go_three_col_stack_only();
                        break;
                }
                break;
            case 'canvas_only':
                switch (new_col_mode) {
                    case '1col':
                        lmm.go_one_col_canvas_only();
                        break;
                    case '2col':
                        lmm.go_two_col_canvas_only();
                        break;
                    case '3col':
                        lmm.go_three_col_canvas_only();
                        break;
                }
                break;
        }

    }

    return {
        switch_mode:switch_mode,
        notify_width_change:notify_width_change
    }
}
var decider = LayoutDecider();


$(window).resize(function(){
    var calcwidth = $('#one-col-full').width();
    var layout_mode = angular.element($('#col_layouts')).scope().viewoptions.layout_mode;
    decider.notify_width_change(calcwidth, layout_mode);
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
        layout_mode: "full"     // full, stack_only, canvas_only
    };

    $scope.$watch('viewoptions.layout_mode', function() {
        console.log('angular watch');
//        decider.switch_mode($scope.viewoptions.layout_mode, cmm.get_col_mode());
        decider.switch_mode($scope.viewoptions.layout_mode, col_mode);
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
    cmm - depends on lmm, models col_mode
    lmm - depends on cmm
    decider - depends on lmm and cmm
also
    resize function - depends on decider and angular viewoptions.layout_mode
    angular ViewOptionsController - depends on decider, models show_debug and viewoptions.*
 */
