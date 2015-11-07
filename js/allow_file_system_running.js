/**
 * Created by Andy on 7/11/2015.
 *
 * Include this just before jquery.mobile is loaded to allow running without a webserver
 * on Chrome.
 * See http://stackoverflow.com/questions/32453806/uncaught-securityerror-failed-to-execute-replacestate-on-history-cannot-be
 */

$(document).bind('mobileinit',function(){
    $.mobile.changePage.defaults.changeHash = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
});

