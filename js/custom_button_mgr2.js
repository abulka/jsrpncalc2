function CustomButtonsMgr(jsparser, custom_keys_page, cmd_executor, is_jqm, clicksound)
{
    // PRIVATE

    var _custom_keys_page = custom_keys_page;

    function buildButton(params, $attachto) {
        var element = $('<a>' + params['function_name'] + '</a>');

        if (is_jqm) {
            element.attr('data-role', "button").attr('data-mini', true).attr('data-inline', true).attr('data-theme', "a");
            element.button(); // give jqm a chance to style it.
        }
        if (clicksound != undefined) {
            element.on('vmousedown', function() { clicksound.play(); });
        }

        element.on("click dblclick", onClickDoExecute);  // Wire up event handler for our new custom button.
        // Note we don't listen for swipe, since custom buttons on the carousel
        // are likely to be swiped and the intent is for the carousel to move

        $attachto.append(element);
        //console.log('buildButton built element:', element);
        return element;
    }

    function onClickDoExecute(event) {
        cmd_executor.execute($(this).data('cmd'));
    }

    function clearButtons() {
        _custom_keys_page.html('');
    }

    // PUBLIC

    function rebuildAllButtons() {
        var btb = jsparser.parse();  // btb means buttons_to_build
        clearButtons();  // Clear old buttons
        for (var i = 0; i < btb.length; i++) {
            var element = buildButton(btb[i], _custom_keys_page);
            element.data('cmd', { function_to_call: btb[i].function_name,
                params: btb[i].params });
        }
    }

    return {
        rebuildAllButtons: rebuildAllButtons,
    }

};
