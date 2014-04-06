var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();

        // if not in phonegap then go straight away I guess.
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //alert('Received Event onDeviceReady');

    }
};

$(window).load(function () {
    // executes when complete page is fully loaded (all frames, objects and images)

    // introduce a slight delay to allow widgets to settle and the width values more reliable
    setTimeout(function () {
        onResize();
    }, 10);


    // Global events

    $(document).trigger( "boot" );

    $(document).on("pageshow", "#col_layouts", function() { // When entering main calc page
        $(document).trigger( 'wire_global_keys', true );
    });
    $(document).on("pageshow", "#options", function() { // When entering pagetwo
        $(document).trigger( 'wire_global_keys', false );
    });


    // Editor and parser

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

    var rpn = {}
    rpn.popper = function() { return { 'val' : 100, 'val_type' : typeof 100 } };
    rpn.pusher = function(val) { console.log('pushed val', val); };

    var tape = {};
    tape.log = function(s) { console.log(s); };

    var cmd_executor = CmdExecutor(rpn, tape);
    var custom_button_mgr = new CustomButtonsMgr(jsparser, $('#customKeysPage'), cmd_executor, true, clicksound);

    $("#btnReparse").on('click', function(event, ui) {
        custom_button_mgr.rebuildAllButtons();
    });

    custom_button_mgr.rebuildAllButtons();

    // Editor navigation

    $('#go_editor').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks
        $.mobile.changePage("#options", "flip", true, false);
    });

    // Prevent first time no display bug
    $('#options').on('pageshow',function(){
      $('.CodeMirror').each(function(i, el){
          el.CodeMirror.refresh();
      });
    });

});

app.initialize();
