// Keypad
//
// We don't have an angular controller for the numeric keypad because its too slow.  So we just use regular 'legacy'
// javascript/jquery.  When needed, we invoke functions on the angular stack controller e.g. enter.

$(document).ready(function () {
    // executes when HTML-Document is loaded and DOM is ready
    LegacyFastKeyPad();
});

function LegacyFastKeyPad() {
    // fast click magic technique

    var current_in = $('#current');
    var btns = $('#click1,#click2,#click3,#click4,#click5,#click6,#click7,#click8,#click9,#click0');
    var stack_controller = angular.element($('#stack')).scope();

    // 1 2 3 4 5 6 7 8 9 0

    btns.on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks

        appendDigit(event.target.text);

        // Debug, self clearing cmd for testing only
        if (current_in.val().length > 25)
            current_in.val('');
    });

    // .

    $('#click_dot').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks

        if (current_in.val().indexOf('.') == -1)  // don't allow more than one dot
            appendDigit(event.target.text);
    });

    // * / - +

    $('#click_divide').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        appendDigit(event.target.text);
    });

    $('#click_times').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        appendDigit(event.target.text);
    });

    $('#click_minus').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        flush_cmd_to_stack();
        if (stack_has_same_type('number')) {
            var val1 = stack_controller.pop();
            var val2 = stack_controller.pop();
            var result = val2.val - val1.val;
            stack_controller.$apply(stack_controller.push(result));
        }
    });

    $('#click_add').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        flush_cmd_to_stack();
        if (stack_has_same_type('number') || stack_has_same_type('string')) {
            var val1 = stack_controller.pop();
            var val2 = stack_controller.pop();
            var result = val2.val + val1.val;
            stack_controller.$apply(stack_controller.push(result));
        }
        else if (stack_has_same_type('array')) {
            var val1 = stack_controller.pop();
            var val2 = stack_controller.pop();
            var result = val1.val.concat(val2.val);
            stack_controller.$apply(stack_controller.push(result));
        }
    });


    // ENTER

    $('#clickEnter').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks

        // talk to stack
        if (current_in.val() == '')
            stack_controller.$apply(stack_controller.random_num());  // need apply so that events trigger
        else {
            stack_controller.$apply(stack_controller.push(current_in.val()));
        }
        current_in.val('');
    });


    // Clear

    $('#clickC').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks

        str = current_in.val().substring(0, current_in.val().length - 1);
        current_in.val(str);
    });

    $('#clickAC').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks

        if (current_in.val() == '')
            stack_controller.$apply(stack_controller.clear());  // need apply so that events trigger
        else
            current_in.val('');
    });


    // Util

    function appendDigit(s) {
        current_in.val(current_in.val() + s).keyup();
    }

    function flush_cmd_to_stack() {
        if (current_in.val() != '') {
            stack_controller.$apply(stack_controller.push(current_in.val()));
            current_in.val('');
        }
    }

    function stack_has_same_type(type) {
        var stack = stack_controller.getStack();
        var l = stack_controller.len();
        if (l >= 2) {
            var val1 = stack[l-1];
            var val2 = stack[l-2];
            return val1.type == type && val2.type == type;
        }
        else
            return false;
    }

}



