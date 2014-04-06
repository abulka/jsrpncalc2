// parsing test stuff to go here

$(document).ready(function () {
    // executes when HTML-Document is loaded and DOM is ready
});

$(window).load(function () {
    // executes when complete page is fully loaded (all frames, objects and images)

    var code_textarea = $("#code")[0];

    var editor = CodeMirror.fromTextArea(code_textarea, {
        lineNumbers: true,
        matchBrackets: true,
        tabSize: 4,
        mode: {name: "javascript", json: true},
        autoClearEmptyLines: true,
        lineWrapping: false
    });
    var jsparser = JsParser(editor);

    var clicksound = undefined;

    var rpn = {}
    rpn.popper = function() { return { 'val' : 100, 'type' : typeof 100 } };
    rpn.pusher = function(val) { console.log('pushed val', val); };

    var tape = {};
    tape.log = function(s) { console.log(s); };

    var cmd_executor = CmdExecutor(rpn, tape);
    var custom_button_mgr = CustomButtonsMgr(jsparser, $('#customKeysPage'), cmd_executor, false, clicksound);

    $("#btnReparse").on('click', function(event, ui) {
        custom_button_mgr.rebuildAllButtons();
    });

    custom_button_mgr.rebuildAllButtons();

});