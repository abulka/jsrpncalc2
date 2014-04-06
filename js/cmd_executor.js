function CmdExecutor(rpn, tape) {
    var last_execute_info = undefined;

    var executeAgain = function () {
        if (last_execute_info != undefined)
            execute(last_execute_info);
    }

    var execute = function (cmd) {
        tape.log(cmd);
        last_execute_info = cmd;

        // Need to call
        // flush_cmd_to_stack(); - but how?  its inside keypad.js
        // which is not even an instance, it just runs.
        // HACK for now
        var current_in = $('#current_cmd');
        var stack_controller = angular.element($('#stack')).scope();
        function flush_cmd_to_stack() {
            if (current_in.val() != '') {
                stack_controller.$apply(stack_controller.push(current_in.val()));
                current_in.val('');
            }
        }
        flush_cmd_to_stack();
        // END HACK

        // Build parameters string.
        // There must be a better way than this e.g. by using the argument array.
        var p = "";
        $.each(cmd.params, function (index, value) {
            console.log('parameter', index, 'named', value.name);
            if (p != "")
                p += ", ";

            // Pop a needed parameter off the stack
            var parameter = rpn.popper();  // returns an object e.g. { 'val' : 100, 'type' : typeof 100 }
            if (parameter.type == "string")  // 'type' here is our own invented property
                p += '"' + parameter.val + '"';
            else
                p += JSON.stringify(parameter.val);//.toString();
        });

        // Build the final user function command to call
        var cmd = cmd.function_to_call + "(" + p + ");"
        tape.log(cmd);
        var result = eval(cmd);

        if (result != undefined) {
            rpn.pusher(result);
            tape.log(result);
        }
    }

    return {
        execute: execute,
        executeAgain: executeAgain
    }
};
