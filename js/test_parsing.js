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
    var jsparser = new JsParser(editor);

    var clicksound = undefined;
    var log = function(o) { console.log(o); }  // later remap this to tape
    var rpn = {}
    rpn.popper = function() { console.log('popper called');
        return { 'val' : 100, 'val_type' : typeof 100 }
    }
    rpn.pusher = function(val) { console.log('pushed val', val); }
    var custom_button_mgr = new CustomButtonsMgr(jsparser, clicksound, log, rpn);

    $("#btnReparse").on('click', function(event, ui) {
        custom_button_mgr.rebuildAllButtons();
    });

    custom_button_mgr.rebuildAllButtons();

});