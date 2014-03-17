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

    $('#clickEnter').on('vmousedown', function (event) {
        event.preventDefault();  // prevent ghost clicks

//        console.log(event.target.text, current_in.val());

        // talk to stack
        var scope = angular.element($('#stack')).scope();
        if (current_in.val() == '')
            scope.$apply(scope.enter());  // need apply so that events trigger
        else {
//            scope.$apply(scope.push(current_in.val()));  // need apply so that events trigger

            // talk to stack - try using events too -  works - but only if stack controller intercepts scope.on NOT rootScope.on
            var scope2 = angular.element($('#keypad_outer')).scope();
            console.log('scope2', scope2);
            scope2.$apply(scope2.$broadcast('push', current_in.val()));
        }
        
        current_in.val('');
    });


    // Misc
    $('.popupRpnCmds').on('click', function (e) {
        //$( "#popupRpnCmds" ).popup( "close" );
    });

});

myApp.controller('KeyPad', function ($scope, $rootScope) {
//    $scope.enter = function () { $scope.$emit('push', 10); }
});



