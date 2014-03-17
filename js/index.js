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

$(window).load(function () {
    // executes when complete page is fully loaded (all frames, objects and images)

    // introduce a slight delay to allow widgets to settle and the width values more reliable
    setTimeout(function () {
        onResize();
    }, 10);

});

