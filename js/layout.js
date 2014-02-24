
(function wire_debug_buttons() {
    $('#show_all_layouts').on('click', function(e) { cmm.show_all_debug(); });
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
})();


function col_mode_mgr() {

    var col_mode = undefined;                // 1col or 2col or 3col

    function show_all_debug() {
        lmm.move_widgets_out();
        $('#one-col-full').show();
        $('#two-col-full').show();
        $('#three-col-full').show();
        col_mode = undefined;
    }

    function col_mode_1col() {
        //if (col_mode == "1col") return;
        $('#one-col-full').show();
        $('#two-col-full').hide();
        $('#three-col-full').hide();
        col_mode = "1col";
        //console.log('switched col mode to', col_mode);
    }
    function col_mode_2col() {
        //if (col_mode == "2col") return;
        $('#one-col-full').hide();
        $('#two-col-full').show();
        $('#three-col-full').hide();
        col_mode = "2col";
        //console.log('switched col mode to', col_mode);
    }
    function col_mode_3col() {
        //if (col_mode == "3col") return;
        $('#one-col-full').hide();
        $('#two-col-full').hide();
        $('#three-col-full').show();
        col_mode = "3col";
        //console.log('switched col mode to', col_mode);
    }

    return {
        show_all_debug:show_all_debug,
        get_col_mode:function() {return col_mode;},
        'col_mode_1col':col_mode_1col,
        'col_mode_2col':col_mode_2col,
        'col_mode_3col':col_mode_3col,
    }
}
var cmm = col_mode_mgr();


function layout_mode_mgr() {

    var one_col_layout_mode = 'full';        // full, stack_only, canvas_only
    var two_col_layout_mode = 'full';        // full, stack_only, canvas_only
    var three_col_layout_mode = 'full';      // full, stack_only, canvas_only

    function calc_layout_modes() {
        one_col_layout_mode = _calc_layout_mode_for($('#one-col-full'));
        two_col_layout_mode = _calc_layout_mode_for($('#two-col-full'));
        three_col_layout_mode = _calc_layout_mode_for($('#three-col-full'));
        $('#one_col_layout_mode').text(one_col_layout_mode);
        $('#two_col_layout_mode').text(two_col_layout_mode);
        $('#three_col_layout_mode').text(three_col_layout_mode);
    }

    function _calc_layout_mode_for($outer) {
        var stack_visible = $outer.find('.stack').is(":visible");
        var canvas_visible = $outer.find('.canvas').is(":visible");
        if (stack_visible && canvas_visible)
            return 'full';
        else if (stack_visible && !canvas_visible)
            return 'stack_only';
        else if (!stack_visible && canvas_visible)
            return 'canvas_only';
        else {
            console.log('unknown mode - neither stack or canvas are visible.', $outer, $outer.is(":visible"));
            return undefined;
        }
    }

    function reset_to_full_show_all() {
        // Show all outer modes so that logic isn't corrupted by child visibility issues
        $('#one-col-full').show();
        $('#two-col-full').show();
        $('#three-col-full').show();

        if (one_col_layout_mode == 'stack_only')
            one_col_layout_toggle_stack_only();  // toggle it back to full
        else if (one_col_layout_mode == 'canvas_only')
            one_col_layout_toggle_canvas_only();  // toggle it back to full
//        else


        if (two_col_layout_mode == 'stack_only')
            two_col_layout_toggle_stack_only();  // toggle it back to full
        else if (two_col_layout_mode == 'canvas_only')
            two_col_layout_toggle_canvas_only();  // toggle it back to full
        else
            $('#canvas').height($('#two-col-full .col1 .stack').height());

        if (three_col_layout_mode == 'stack_only')
            three_col_layout_toggle_stack_only();  // toggle it back to full
        else if (three_col_layout_mode == 'canvas_only')
            three_col_layout_toggle_canvas_only();  // toggle it back to full

        move_widgets_out();
    }

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

    // Toggle layout functions - these are complex

    function one_col_layout_toggle_stack_only() {
        $('#one-col-full .canvas').toggle();
        $('#one-col-full .row2').toggleClass('col');
        calc_layout_modes();
    }
    function one_col_layout_toggle_canvas_only() {
        if ($('#one-col-full .stack').is(":visible")) {
            $('#one-col-full .canvas').after($('#one-col-full .cmd'));
        }
        else {
            $('#one-col-full .stack').after($('#one-col-full .cmd'));
        }
        $('#one-col-full .stack').toggle();
        $('#one-col-full .keypad').toggle();
        $('#one-col-full .row1').toggle();

        if ($('#one-col-full .stack').is(":visible"))
            two_col_layout_mode = 'full';
        else
            two_col_layout_mode = 'canvas_only';
        calc_layout_modes();
    }

    function two_col_layout_toggle_stack_only() {
        $('#two-col-full .canvas').toggle();
        calc_layout_modes();
    }
    function two_col_layout_toggle_canvas_only() {
        $('#two-col-full .stack').toggle();
        $('#two-col-full .keypad').toggle();
        if ($('#two-col-full .canvas').hasClass('canvas100')) {
            $('#two-col-full .stack').after($('#two-col-full .cmd'));
            $('#two-col-full .custom').before($('#two-col-full .canvas'));
        }
        else {
            $('#two-col-full .canvas').after($('#two-col-full .cmd'));
            $('#two-col-full .keypad').after($('#two-col-full .canvas'));
        }
        $('#two-col-full .canvas').toggleClass('canvas100');
        calc_layout_modes();
    }

    function three_col_layout_toggle_stack_only() {
        var $stack = $('#three-col-full .stack');
        var $canvas = $('#three-col-full .canvas');
        var $cmd = $('#three-col-full .cmd');
        var $keypad = $('#three-col-full .keypad');

        $canvas.toggle();
        if ($stack.hasClass('stack100')) {
            $stack.after($keypad);
            $stack.after($cmd);
        }
        else {
            $canvas.after($keypad);
            $canvas.after($cmd);
        }
        $stack.toggleClass('stack100');
        $cmd.toggleClass('cmd100');
        $keypad.toggleClass('keypad100');
//        three_col_match_col1();
        calc_layout_modes();
    }
    function three_col_layout_toggle_canvas_only() {
        var $col2 = $('#three-col-full .col2');
        if ($col2.hasClass('float66'))
            $('#three-col-full .stack').after($('#three-col-full .cmd'));
        else
            $('#three-col-full .custom').before($('#three-col-full .cmd'));
        $('#three-col-full .col1').toggle();
        $col2.toggleClass('float33');
        $col2.toggleClass('float66');
//        three_col_match_col1();
        calc_layout_modes();
    }
    function three_col_match_col1() {
        console.log($('#three-col-full .col1').height());
        $('#three-col-full .col2').height($('#three-col-full .col1').height());
        $('#three-col-full .canvas').toggleClass('canvas100');

        console.log($('#three-col-full .col1').height());
    }

    // Go functions - these are the high level functions

    function go_one_col_full() {
        reset_to_full_show_all();
        move_widgets_in($('#one-col-full'));
        cmm.col_mode_1col(); }
    function go_one_col_stack_only() {
        reset_to_full_show_all();
        one_col_layout_toggle_stack_only();
        move_widgets_in($('#one-col-full'));
        cmm.col_mode_1col(); }
    function go_one_col_canvas_only() {
        reset_to_full_show_all();
        one_col_layout_toggle_canvas_only();
        move_widgets_in($('#one-col-full'));
        cmm.col_mode_1col(); }

    function go_two_col_full() {
        reset_to_full_show_all();
        move_widgets_in($('#two-col-full'));
        cmm.col_mode_2col(); }
    function go_two_col_stack_only() {
        reset_to_full_show_all();
        two_col_layout_toggle_stack_only();
        move_widgets_in($('#two-col-full'));
        cmm.col_mode_2col(); }
    function go_two_col_canvas_only() {
        reset_to_full_show_all();
        two_col_layout_toggle_canvas_only();
        move_widgets_in($('#two-col-full'));
        cmm.col_mode_2col(); }

    function go_three_col_full() {
        reset_to_full_show_all();
        move_widgets_in($('#three-col-full'));
        three_col_match_col1();

        cmm.col_mode_3col(); }
    function go_three_col_stack_only() {
        reset_to_full_show_all();
        three_col_layout_toggle_stack_only();
        move_widgets_in($('#three-col-full'));
        cmm.col_mode_3col(); }
    function go_three_col_canvas_only() {
        reset_to_full_show_all();
        three_col_layout_toggle_canvas_only();
        move_widgets_in($('#three-col-full'));
        cmm.col_mode_3col(); }

    return {
        calc_layout_modes:calc_layout_modes,
        reset_to_full_show_all:reset_to_full_show_all,
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
        if (calcwidth < 400 && cmm.get_col_mode() != "1col")
            switch_mode(layout_mode, "1col");
        else if (calcwidth > 400 && calcwidth < 450 && cmm.get_col_mode() != "2col")
            switch_mode(layout_mode, "2col");
        else if (calcwidth > 500 && calcwidth < 600 && cmm.get_col_mode() != "3col")
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
        decider.switch_mode($scope.viewoptions.layout_mode, cmm.get_col_mode());
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
