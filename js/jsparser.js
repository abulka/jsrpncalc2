function JsParser(editor) {
    var syntax;
    var buttons_to_build = [];
    var last_function_call_params = undefined;

    // Private Methods ------------------------

    // See http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    var globalEval = function (src) {
        if (window.execScript) // eval in global scope for IE
            window.execScript(src);
        else // other browsers
            eval.call(null, src);
    }

    // Public Methods -------------------------

    function getButtonsToBuild() {
        return buttons_to_build;
    }

    function parse(code) {
        buttons_to_build = [];

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
        globalEval(code);

        return buttons_to_build;
    }

    var executeAgain = function () {
        if (last_function_call_params != undefined)
            execute(last_function_call_params);
    }

    var execute = function (params_dict) {
        console.log('doeval, params_dict=', params_dict);
        var function_to_call = params_dict['function_to_call'];
        var num_params = params_dict['num_params'];
        var params = params_dict['params'];
        var rpn = params_dict['rpnstack'];  // even though rpn and log are available globally (for now)
        var log = params_dict['log'];       // best we explicitly get them passed in.

        last_function_call_params = params_dict;

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

    // Return interface -----------------------

    return {
        parse: parse,
        getButtonsToBuild: getButtonsToBuild,
        execute: execute,
        executeAgain: executeAgain
    }

};
  
