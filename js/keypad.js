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

    var current_in = $('#current_cmd');
    var btns = $('#click1,#click2,#click3,#click4,#click5,#click6,#click7,#click8,#click9,#click0');
    var stack_controller = angular.element($('#stack')).scope();

    // 1 2 3 4 5 6 7 8 9 0

    btns.on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        digit(event.target.text);
    });

    // .

    $('#click_dot').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        dot(event);
    });

    // * / - +

    $('#click_divide').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        divide();
    });

    $('#click_times').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        times();
    });

    $('#click_minus').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        minus();
    });

    $('#click_add').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        plus();
    });

    // Guts of the operators

    function plus() {
        flush_cmd_to_stack();
        if (stack_has_same_type('number') || stack_has_same_type('string')) {
            OP2(function (valy, valx) {
                return valy.val + valx.val
            });
        }
        else if (stack_has_same_type('array')) {
            OP2(function (valy, valx) {
                return valy.val.concat(valx.val)
            });
        }
    }

    function minus() {
        flush_cmd_to_stack();
        if (stack_has_same_type('number')) {
            OP2(function (valy, valx) {
                return valy.val - valx.val
            });
        }
    }

    function times() {
        flush_cmd_to_stack();
        if (stack_has_same_type('number')) {
            OP2(function (valy, valx) {
                return valy.val * valx.val
            });
        }
    }

    function divide() {
        flush_cmd_to_stack();
        if (stack_has_same_type('number')) {
            OP2(function (valy, valx) {
                return valy.val / valx.val
            });
        }
    }

    function dot() {
        if (current_in.val().indexOf('.') == -1)  // don't allow more than one dot
            appendDigit('.');
    }

    function enter() {
        // talk to stack
        if (current_in.val() == '') {

            // Random number behaviour
            // stack_controller.$apply(stack_controller.random_num());  // need apply so that events trigger

            // Normal duplication behaviour
            stack_controller.$apply(stack_controller.dup());  // need apply so that events trigger
        }


        else {
            stack_controller.$apply(stack_controller.push(current_in.val()));
        }
        current_in.val('');
    }

    function backspace() {
        var str = current_in.val().substring(0, current_in.val().length - 1);
        current_in.val(str);
    }

    function digit(val) {
        appendDigit(val);

        // Debug, self clearing cmd for testing only
        if (current_in.val().length > 25)
            current_in.val('');
    }


    // Handy util for applying a function to the two top atgs of the stack and pushes result back on to stack

    function OP2(f) {
        var valx = stack_controller.pop();
        var valy = stack_controller.pop();
        var result = f(valy, valx);
        stack_controller.$apply(stack_controller.push(result));
    }


    // ENTER

    $('#clickEnter').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        enter();
    });


    // Clear

    $('#clickC').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        backspace();
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

    // Keyboard

    function global_keys_on() {
        $(document).on('keydown', on_arrow_keys);
        $(document).on('keypress', on_digit_keys);
    }

    function global_keys_off() {
        $(document).off('keydown', on_arrow_keys);
        $(document).off('keypress', on_digit_keys);
    }

    current_in.on( "focus", function () {
        console.log("Handler for .focus() called.");
        global_keys_off();
    });

    current_in.on( "focusout", function () {
        console.log("Handler for focusout called.");
        global_keys_on();
    });

    function wire_main_page_global_keys_on() {
        // Always on, on the main calc page
        $(document).on('keypress', on_enter_key);
        $(document).on('keydown', on_esc_key);

        // Init on, but can be switched off when cmd gets input
        $(document).on('keydown', on_arrow_keys);
        $(document).on('keypress', on_digit_keys);
    }
    function wire_main_page_global_keys_off() {
        $(document).off('keypress', on_enter_key);
        $(document).off('keydown', on_esc_key);
        $(document).off('keydown', on_arrow_keys);
        $(document).off('keypress', on_digit_keys);

    }

    function on_enter_key(e){
        if (e.which == 13)  // enter
            enter();
    }

    function on_esc_key(e){
        if (e.which == 27)  // esc
            current_in.blur();  // why can't I call focusout ?  Oh well, blur works.
    }

    function on_arrow_keys(e) {
        var keycode = e.which;
        //console.log('doc keydown', keycode);

        if (e.keyCode == 8) {  // DELETE
            backspace();
            return false;     // prevent document navigation backwards
        }

        // Arrow keys
        switch (e.which) {
            case 38: // UP
                stack_controller.$apply(stack_controller.rup());
                break;
            case 40: // DOWN
                stack_controller.$apply(stack_controller.rdn());
                break;
            case 39: // RIGHT
                stack_controller.$apply(stack_controller.swap());
                break;
            case 37: // LEFT
                backspace();
                break;
        }
    }
    function on_digit_keys(e){
        var keycode = e.which;
        //console.log('doc keypress', keycode);
        switch (e.which) {
            case 43: // +
                plus();
                break;
            case 45: // -
                minus();
                break;
            case 42: // *
                times();
                break;
            case 47: // /
                divide();
                break;
        }
        if (keycode >= 48 && keycode <= 57) {
            var ch = String.fromCharCode(keycode);
            digit(ch);
        }
        else if (keycode == 46)
            dot();
    }

    // Handle broadcasted events (normal javascript custom events)

    $(document).on('boot', function (e) {
        //console.log('boot', e.target);
        wire_main_page_global_keys_on();
    });

    $(document).on('wire_global_keys', function (e, enable) {
        //console.log('wire_global_keys', e.target, 'enabled=', enable);
        if (enable)
            wire_main_page_global_keys_on();
        else
            wire_main_page_global_keys_off();
    });

}



