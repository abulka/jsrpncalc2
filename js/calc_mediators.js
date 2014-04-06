/**
 * Created by Andy on 6/04/14.
 */
function Rpn()
{
    // Wraps access to the rpn stack controller

    var stack_controller = angular.element($('#stack')).scope();

    function pusher(val) {
        stack_controller.$apply(stack_controller.push(val));  // need apply so that events trigger
    }
    function popper() {
        var result = stack_controller.pop();
        stack_controller.$apply();  // update dom in angular land - since we popped a value.  Doing the pop inside the apply doesn't give us a return value, so we do it in two steps
        return result;
    }

    return {
        pusher: pusher,
        popper: popper
    }
};


function CmdController() {
    var current_in = $('#current_cmd');
    var stack_controller = angular.element($('#stack')).scope();

    function flush_cmd_to_stack() {
        if (current_in.val() != '') {
            stack_controller.$apply(stack_controller.push(current_in.val()));
            current_in.val('');
        }
    }

    return {
        flush_cmd_to_stack:flush_cmd_to_stack
    }
}
