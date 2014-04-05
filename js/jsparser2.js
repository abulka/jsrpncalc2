function JsParser(editor) {
    var syntax;
    var last_execute_info = undefined;

    // Private Methods ------------------------

    var evalGlobal = function (code) {
        if (window.execScript)          // eval in global scope for IE, See http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
            window.execScript(code);
        else                            // other browsers
            eval.call(null, code);
    }

    // Public Methods -------------------------

    function parse(code) {
        // Returns array of buttons to build
        var buttons_to_build = [];

        if (code == undefined)
            var code = editor.getValue();

        syntax = esprima.parse(code);

        // Scan the parse tree for functions
        for (var i = 0; i < syntax.body.length; ++i) {
            var el = syntax.body[i];
            var button_building_params = {
                'function_name': el.id.name,
                'num_params': el.params.length,
                'params': jQuery.extend({}, el.params) // shallow copy
            }
            buttons_to_build.push(button_building_params);
        }

        // Make sure javascript knows about everything in the code,
        // so that later evals work correctly
        evalGlobal(code);

        return buttons_to_build;
    }

    var executeAgain = function () {
        if (last_execute_info != undefined)
            execute(last_execute_info);
    }

    var execute = function (data) {
        console.log('execute,', data);
        
        var function_to_call = data.function_to_call;
        var num_params = data.num_params;
        var params = data.params;
        var rpn = data.rpnstack;  // even though rpn and log are available globally (for now)
        var log = data.log;       // best we explicitly get them passed in.

        last_execute_info = data;

        // Build parameters string.
        // There must be a better way than this e.g. by using the argument array.
        var p = "";
        $.each(params, function (index, value) {
            console.log('param', index, value.name);
            if (p != "")
                p += ", ";

            // Pop a needed parameter off the stack
            var parameter = rpn.popper();
            if (parameter.val_type == "string")
                p += '"' + parameter.val + '"';
            else
                p += JSON.stringify(parameter.val);//.toString();
        });

        // Build the final user function command to call
        var cmd = function_to_call + "(" + p + ");"
        console.log(cmd);
//    log(cmd);
        var result = eval(cmd);

        if (result != undefined) {
            rpn.pusher(result);
            log(result);
        }

    }

    return {
        parse: parse,
        execute: execute,
        executeAgain: executeAgain
    }

};
  
