
/*javascript external to angular applies to a scope*/
// see http://jsfiddle.net/spacm/HeMZP/

function tellAngular() {
    console.log("tellAngular call");
    scope = angular.element($('#someDiv')).scope();
//    scope.$apply(function() {
//        scope.viewoptions.width = window.innerWidth;
//        scope.viewoptions.height = window.innerHeight;
////        scope.width = window.innerWidth;
////        scope.height = window.innerHeight;
//    });

    // this doesn't work!!  go gets called but the subsequent watch functions
    // watching any scope vars changed by this don't trigger !!!
//    scope.go(window.innerWidth, window.innerHeight);

    // this fixes the problem !!  Need to wrap the call in a scope.$apply()
    // see http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
    scope.$apply(scope.go(window.innerWidth, window.innerHeight));
}

//first call of tellAngular when the dom is loaded
//document.addEventListener("DOMContentLoaded", tellAngular, false);

//calling tellAngular on resize event
window.onresize = tellAngular;

/*angular controller*/

function myCtrl($scope) { /*classical scope definition*/
    $scope.infoTxt = "Please resize your window.";
    $scope.viewoptions = {
        width: undefined,
        height: undefined
    };
    $scope.$watch('viewoptions', function() {
        console.log('angular watch ** viewoptions');
    }, true);
    $scope.go = function(width, height) {
        // Yey - I can change two model states at once and only get one watch event
        // when watching the parent viewoptions
//        $scope.viewoptions.layout_mode = layout_mode;
        $scope.viewoptions.width = width;
        $scope.viewoptions.height = height;
        console.log('resize GO called, vars set to: width=', width, 'height=', height);

    }
//    $scope.width = undefined;
//    $scope.height = undefined;
//    $scope.$watch('width', function() {
//        console.log('angular watch ** width');
//    }, true);

}

