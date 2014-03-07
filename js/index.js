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

var myApp = angular.module('myApp', []);

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

$(window).load(function () {
    // executes when complete page is fully loaded (all frames, objects and images)

    // introduce a slight delay to allow widgets to settle and the width values more reliable
    setTimeout(function () {
        onResize();
    }, 10);

});

