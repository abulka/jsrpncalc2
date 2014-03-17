// Keypad

$(document).ready(function () {
    // executes when HTML-Document is loaded and DOM is ready

    // Wire up the non angular buttons and input box
    var current_in = $('#current');
    var btns = $('#click1,#click2,#click3,#click4,#click5,#click6,#click7,#click8,#click9');

    function appendDigit(s) {
        current_in.val(current_in.val() + s).keyup();
    }

    // fast click magic technique
    btns.on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks

        appendDigit(event.target.text);
        if (current_in.val().length > 25)
            current_in.val('');
    });

    // Misc
    $('.popupRpnCmds').on('click', function (e) {
        //$( "#popupRpnCmds" ).popup( "close" );
    });

});

myApp.controller('KeyPad', function ($scope, $rootScope, xxxx) {
});

myApp.factory('xxxx', function () {
    function scroll_to_bottom() {
        setTimeout(function() {
            var $stackgui = $('#stack');
            $stackgui.scrollTop(
              $stackgui[0].scrollHeight - $stackgui.height()
            );
        }, 0);
    }

    function set_stack_height(n) {
        var new_height = (n+0.75).toString()+'em';
        $('#stack').height(new_height);
    }

    return {
        scroll_to_bottom: scroll_to_bottom,
        set_stack_height: set_stack_height
    }
});

