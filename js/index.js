var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        // if not in phonegap then go straight away I guess.
        init();
        update_modes();
        go_one_col_full();

    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //alert('Received Event onDeviceReady');

    }
};



$('.do').on('click', function(e) {
    undo();
    init();

    var target = $(e.target).attr('data-target');
    target = $('#'+target);
    build(target);
});
$('#undo').on('click', function(e) { undo(); });
$('#tape_toggle').on('click', function(e) { tape_toggle(); });

$('#one_col_full_layout').on('click', function(e) { go_one_col_full(); });
$('#two_col_full_layout').on('click', function(e) { go_two_col_full(); });
$('#three_col_full_layout').on('click', function(e) { go_three_col_full(); });

$('#one_col_stack_only').on('click', function(e) { go_one_col_stack_only(); });
$('#two_col_stack_only').on('click', function(e) { go_two_col_stack_only(); });
$('#three_col_stack_only').on('click', function(e) { go_three_col_stack_only(); });

$('#one_col_canvas_only').on('click', function(e) { go_one_col_canvas_only(); });
$('#two_col_canvas_only').on('click', function(e) { go_two_col_canvas_only(); });
$('#three_col_canvas_only').on('click', function(e) { go_three_col_canvas_only(); });

var outer_mode = undefined;  // 1col or 2col or 3col

var one_col_mode = 'full';
var two_col_mode = 'full';
var three_col_mode = 'full';

function _update_mode($outer) {
    var stack_visible = $outer.find('.stack').is(":visible");
    var canvas_visible = $outer.find('.canvas').is(":visible");
    if (stack_visible && canvas_visible)
        return 'full';
    else if (stack_visible && !canvas_visible)
        return 'stack_only';
    else if (!stack_visible && canvas_visible)
        return 'canvas_only';
    else
        console.log('unknown mode - neither stack or canvas are visible.', $outer, $outer.is(":visible"));
}
function update_modes() {
    one_col_mode = _update_mode($('#one-col-full'));
    two_col_mode = _update_mode($('#two-col-full'));
    three_col_mode = _update_mode($('#three-col-full'));
    $('#one_col_mode').text(one_col_mode);
    $('#two_col_mode').text(two_col_mode);
    $('#three_col_mode').text(three_col_mode);
}

function show_one() {
    if (outer_mode == "1col") return;
    $('#one-col-full').show();
    $('#two-col-full').hide();
    $('#three-col-full').hide();
    outer_mode = "1col";
    console.log('switched mode to', outer_mode);
}
function show_two() {
    if (outer_mode == "2col") return;
    $('#one-col-full').hide();
    $('#two-col-full').show();
    $('#three-col-full').hide();
    outer_mode = "2col";
    console.log('switched mode to', outer_mode);
}
function show_three() {
    if (outer_mode == "3col") return;
    $('#one-col-full').hide();
    $('#two-col-full').hide();
    $('#three-col-full').show();
    outer_mode = "3col";
    console.log('switched mode to', outer_mode);
}

function go_one_col_full() {
    reset_to_full(); build($('#one-col-full')); show_one(); }
function go_one_col_stack_only() {
    reset_to_full(); one_col_stack_only(); build($('#one-col-full')); show_one(); }
function go_one_col_canvas_only() {
    reset_to_full(); one_col_canvas_only(); build($('#one-col-full')); show_one(); }

function go_two_col_full() {
    reset_to_full(); build($('#two-col-full')); show_two(); }
function go_two_col_stack_only() {
    reset_to_full(); two_col_stack_only(); build($('#two-col-full')); show_two(); }
function go_two_col_canvas_only() {
    reset_to_full(); two_col_canvas_only(); build($('#two-col-full')); show_two(); }

function go_three_col_full() {
    reset_to_full(); build($('#three-col-full')); show_three(); }
function go_three_col_stack_only() {
    reset_to_full(); three_col_stack_only();
    build($('#three-col-full')); show_three(); }
function go_three_col_canvas_only() {
    reset_to_full(); three_col_canvas_only();
    build($('#three-col-full')); show_three(); }

function reset_to_full() {
    // Show all outer modes so that logic isn't corrupted by child visibility issues
    $('#one-col-full').show();
    $('#two-col-full').show();
    $('#three-col-full').show();

    if (one_col_mode == 'stack_only')
        one_col_stack_only();  // toggle it back to full
    else if (one_col_mode == 'canvas_only')
        one_col_canvas_only();  // toggle it back to full

    if (two_col_mode == 'stack_only')
        two_col_stack_only();  // toggle it back to full
    else if (two_col_mode == 'canvas_only')
        two_col_canvas_only();  // toggle it back to full

    if (three_col_mode == 'stack_only')
        three_col_stack_only();  // toggle it back to full
    else if (three_col_mode == 'canvas_only')
        three_col_canvas_only();  // toggle it back to full

    undo();
    init();
}

function one_col_stack_only() {
    $('#one-col-full .canvas').toggle();
    $('#one-col-full .row2').toggleClass('col');
    update_modes();
}
function one_col_canvas_only() {
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
        two_col_mode = 'full';
    else
        two_col_mode = 'canvas_only';
    update_modes();
}

function two_col_full() {
    update_modes();
}
function two_col_stack_only() {
    $('#two-col-full .canvas').toggle();
    update_modes();
}
function two_col_canvas_only() {
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
    update_modes();
}

function three_col_full() {
    update_modes();
}
function three_col_stack_only() {
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
    update_modes();
}
function three_col_canvas_only() {
    var $col2 = $('#three-col-full .col2');
    if ($col2.hasClass('float66'))
        $('#three-col-full .stack').after($('#three-col-full .cmd'));
    else
        $('#three-col-full .custom').before($('#three-col-full .cmd'));
    $('#three-col-full .col1').toggle();
    $col2.toggleClass('float33');
    $col2.toggleClass('float66');
    update_modes();
}

function build($target) {
  $target.find('.stack').html($('#stack'));
  $target.find('.cmd').html($('#cmd'));
  $target.find('.keypad').html($('#keypad'));
  $target.find('.canvas').html($('#canvas'));
  $target.find('.custom').html($('#custom'));
}

function undo() {
  $('#holding_area').after($('#stack'));
  $('#holding_area').after($('#cmd'));
  $('#holding_area').after($('#keypad'));
  $('#holding_area').after($('#canvas'));
  $('#holding_area').after($('#custom'));
  init();
}
function init() {
  $('div.stack').html('_stack');
  $('div.cmd').html('_cmd');
  $('div.keypad').html('_keypad');
  $('div.canvas').html('_canvas');
  $('div.custom').html('_custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom');
}

function tape_toggle() {
    $('td.tape').toggle();
}

$(window).resize(function(){
    var calcwidth = $('#one-col-full').width();
    //console.log(calcwidth);

    if (calcwidth < 400 && outer_mode != "1col")
        angular.element($('#col_layouts')).scope().go_one_col();
        //go_one_col_full();
    else if (calcwidth > 400 && calcwidth < 450 && outer_mode != "2col") go_two_col_full();
    else if (calcwidth > 500 && calcwidth < 600 && outer_mode != "3col") go_three_col_full();
});



function ViewOptionsController($scope) {
    $scope.show_debug = false;
    $scope.viewoptions = {
        tape_mode: false,
        full_mode: "full"
    };

    $scope.go_one_col = function() {
        console.log('$scope.go_one_col, $scope.viewoptions.full_mode=', $scope.viewoptions.full_mode);
        switch ($scope.viewoptions.full_mode) {
            case 'full':
                go_one_col_full();
                break;
            case 'stack_only':
                go_one_col_stack_only();
                break;
            case 'canvas_only':
                go_one_col_canvas_only();
                break;
        }
    }

    $scope.change_submode = function () {
        console.log('change_submode', 'outer_mode = ', outer_mode);
        switch (outer_mode) {
            case '1col': // 1col or 2col or 3col
                $scope.go_one_col();
                break;
        }
    }

    $scope.go_full = function () {
        console.log('SUBMODE go_full');
    }
    $scope.go_stack_only = function () {
        console.log('SUBMODE go_stack_only');
    }
    $scope.go_canvas_only = function () {
        console.log('SUBMODE go_canvas_only');
    }
}
