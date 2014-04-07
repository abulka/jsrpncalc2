function CustomButtonsMgr(jsparser, custom_keys_page, cmd_executor, is_jqm, clicksound)
{
    // PRIVATE

    var _custom_keys_page = custom_keys_page;

    function buildButton(btn_spec, $attachto) {

        var params = "";
        $.each(btn_spec.params, function (index, value) {
            if (params != "")
                params += ", ";
            params += value.name;
        });
        if (params != '')
            params = "(" + params + ")"

        if (is_jqm) {
            var element = $('<button>' + btn_spec['function_name'] + params + '</a>');
            element.attr('class', "ui-btn ui-mini ui-btn-inline");
            element.button(); // give jqm a chance to style it.
        }
        else
            var element = $('<a>' + btn_spec['function_name'] + params + '</a>');

        if (clicksound != undefined) {
            element.on('vmousedown', function() { clicksound.play(); });
        }

        element.on("click", onClickDoExecute);  // Wire up event handler for our new custom button.
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
