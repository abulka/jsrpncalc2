// parsing test stuff to go here

$(document).ready(function () {
    // executes when HTML-Document is loaded and DOM is ready
});

$(window).load(function () {
    // executes when complete page is fully loaded (all frames, objects and images)

    var want_word_wrap = false;
    var want_line_numbers = true;
    var textarea = $("#code")[0];
    var jsparser = new JsParser(textarea, want_word_wrap, want_line_numbers);

    var persister = {};
    persister.get_editor_text = function() {
        var s = jsparser.editor.getValue();
        console.log('getting editor text', s);
        return s;
    }
    var clicksound = undefined;
    var log = undefined;
    var custom_button_mgr = new CustomButtonsMgr(jsparser, persister, clicksound, log);

    $("#btnReparse").on('click', function(event, ui) {
        custom_button_mgr.rebuild_custom_buttons();
    });

    custom_button_mgr.rebuild_custom_buttons();

});