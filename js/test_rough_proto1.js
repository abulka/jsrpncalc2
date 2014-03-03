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
    $('#hide_custom').on('click', function (e) {
        $('#custom_keys').hide();
    });
});

$(window).load(function () {
    // executes when complete page is fully loaded (all frames, objects and images)

});

