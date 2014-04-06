function JsParser(editor) {
    var syntax;

    var evalGlobal = function (code) {
        if (window.execScript)          // eval in global scope for IE, See http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
            window.execScript(code);
        else                            // other browsers
            eval.call(null, code);
    }

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
                'params': jQuery.extend({}, el.params) // shallow copy
            }
            buttons_to_build.push(button_building_params);
        }

        // Make sure javascript knows about everything in the code,
        // so that later evals work correctly
        evalGlobal(code);

        return buttons_to_build;
    }

    return {
        parse: parse,
    }
};
