// Keypad
//
// We don't have an angular controller for the numeric keypad because its too slow.  So we just use regular 'legacy'
// javascript/jquery.  When needed, we invoke functions on the angular stack controller e.g. enter.

$(document).ready(function () {
    // executes when HTML-Document is loaded and DOM is ready
    LegacyFastKeyPad();
});

function LegacyFastKeyPad() {
    // Wire up the non angular buttons and input box
    var current_in = $('#current');
    var btns = $('#click1,#click2,#click3,#click4,#click5,#click6,#click7,#click8,#click9,#click0,#click_dot');
    var stack_controller = angular.element($('#stack')).scope();

    function appendDigit(s) {
        current_in.val(current_in.val() + s).keyup();
    }

    // fast click magic technique
    btns.on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks

        appendDigit(event.target.text);

        // Debug, self clearing cmd for testing only
        if (current_in.val().length > 25)
            current_in.val('');
    });

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


}



