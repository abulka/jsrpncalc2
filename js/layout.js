var $root_dom = $('#col_layouts');  // wish Angular could detect this and pass it in

myApp.controller('ViewOptionsController', function ($scope, $rootScope, layout_mode_mgr, column_config) {

    $scope.show_debug = false;
    $scope.tape_mode = false;   // true, false
    $scope.viewoptions = {
        layout_mode: "stackonly",    // full, stackonly, canvasonly
        num_cols: 1             // 1,2,3
    };

    // Convenience method to set both vars at the same time.  An alternative is to set both
    // properties individually.
    $scope.go = function (layout_mode, num_cols) {
        //console.log('go called, vars set to: layout_mode=', layout_mode, 'num_cols=', num_cols);
        $scope.viewoptions.layout_mode = layout_mode;
        $scope.viewoptions.num_cols = num_cols;
    }

    // When watching the parent viewoptions I can change two model states at once
    // and only get one watch event - good.  The true parameter means watch recursively inside the viewoptions model
    $scope.$watch('viewoptions', function () {
        //console.log('$watch viewoptions');
        layout_mode_mgr.achieve_layout($scope.viewoptions.num_cols, $scope.viewoptions.layout_mode);
    }, true);

    $scope.$watch('tape_mode', function () {
        //console.log('angular watch tape');
        layout_mode_mgr.achieve_tape($scope.tape_mode);
    }, false);

    // Called by the resize event and also from the dom loaded event
    // Important: In those cases need to wrap those calls within an $apply() to get angular
    // to recheck bindings etc since we are calling from a different 'turn' - see http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
    $scope.on_resize = function (calcwidth) {
        //console.log('on_resize: width', calcwidth, ' currently layout_mode=', layout_mode, 'num_cols=', num_cols);
        //console.log("$(document).width()", $(document).width());

        for (var i = 0; i < column_config.trigger_widths().length; i++) {
            var c = column_config.trigger_widths()[i];
            if (calcwidth >= c.from
                && calcwidth <= c.to
                && $scope.viewoptions.num_cols != c.num_cols_should_be) {
                $scope.go($scope.viewoptions.layout_mode, c.num_cols_should_be);
                break;
            }
        }
    }

    $scope.show_all_layouts = function () {
        layout_mode_mgr.show_all_debug();

        // Exercise calling some services - for no reason
        $rootScope.$broadcast('handleBroadcast', "show_all_debug happening");
    }

    $scope.$on('handleBroadcast', function (event, info) {
        //console.log('EVENT: got message', info);
    });


});

// Angular factories follow the module pattern and also the revealing module pattern :-)
// And you don't have to create an instance of them, which is a bonus - an instance is
// auto injected when you pass in the name of the factory to the parameter list of the
// angular controller.
myApp.factory('layout_mode_mgr', function () {

    function move_widgets_in($target) {
        $target.find('.stack').html($('#stack'));
        $target.find('.cmd').html($('#cmd'));
        $target.find('.keypad').html($('#keypad'));
        $target.find('.canvas').html($('#canvas'));
        $target.find('.custom').html($('#custom'));
    }

    function move_widgets_out() {
        $root_dom.find('.holding_area')
            .after($('#stack'))
            .after($('#cmd'))
            .after($('#keypad'))
            .after($('#canvas'))
            .after($('#custom'));
        repair_layout_placeholder_texts();
    }

    function repair_layout_placeholder_texts() {
        $root_dom.find('div.stack').html('** stack **');
        $root_dom.find('div.cmd').html('** cmd **');
        $root_dom.find('div.keypad').html('** keypad **');
        $root_dom.find('div.canvas').html('** canvas **');
        $root_dom.find('div.custom').html('** custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom _custom **');
    }

    function achieve_layout(num_cols, layout_mode) {
        var $layout = $root_dom.find('.' + layout_mode + '-' + num_cols.toString() + 'col');
        move_widgets_out();
        move_widgets_in($layout);
        $root_dom.find('.container').hide();
        $root_dom.find('.spacer').hide();
        $layout.show();
    }

    function achieve_tape(show_tape) {
        if (show_tape)
            $root_dom.find('td.tape').show();
        else
            $root_dom.find('td.tape').hide();
    }

    function show_all_debug() {
        move_widgets_out();
        $root_dom.find('.spacer').show();
        $root_dom.find('.container').show();
    }

    return {
        move_widgets_in: move_widgets_in,
        move_widgets_out: move_widgets_out,
        achieve_layout: achieve_layout,
        achieve_tape: achieve_tape,
        show_all_debug: show_all_debug
    }
});

myApp.factory('column_config', function () {
    return {
        trigger_widths: function () {
            return [
                { from: 0, to: 450, num_cols_should_be: 1 },
                { from: 451, to: 750, num_cols_should_be: 2 },
                { from: 751, to: 9999, num_cols_should_be: 3 }
            ];
        }
    }
});

$(window).resize(function () {
    onResize();
});

function onResize() {
    var scope = angular.element($root_dom).scope();
    var calc_width = $root_dom.find('.layout_templates').width();
    scope.$apply(scope.on_resize(calc_width));  // need apply so that events trigger

    // experiment with sending an event on the controller from outside
    scope.$broadcast('handleBroadcast', 'resize happened');
}