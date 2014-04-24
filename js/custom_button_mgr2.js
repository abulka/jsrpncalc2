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

    function buildSlider(slider_spec, $attachto) {
        if (is_jqm) {
            //var element = $('<button>' + btn_spec['function_name'] + params + '</a>');
//            var element = $('<label for="slider-0">Input slider:</label>' +
//                            '<input type="range" name="slider" id="slider-0" data-mini="true" value="25" min="0" max="100"/>');
            var element = $('<form>' +
                            '<label for="slider-0">Input slider:</label>' +
                            '<input type="range" name="slider" id="slider-0" value="25" min="0" max="100"/>' +
                            '</form>');

//            element.slider(); // give jqm a chance to style it.
            $attachto.append(element);


//    var toggle_button = '<select data-role="slider"><option value="off">Off</option><option value="on">On</option></select>';
//    $attachto.append(toggle_button);
//    var toggle_button = '<select data-role="slider"><option value="off">Off</option><option value="on">On</option></select>';
//    $attachto.append(toggle_button);
//    var toggle_button = '<select data-role="slider"><option value="off">Off</option><option value="on">On</option></select>';
//    $attachto.append(toggle_button);
//    var toggle_button = '<select data-role="slider"><option value="off">Off</option><option value="on">On</option></select>';
//    $attachto.append(toggle_button);
//    var toggle_button = '<select data-role="slider"><option value="off">Off</option><option value="on">On</option></select>';
//    $attachto.append(toggle_button);
//    $('select').slider();


        }
    }

    function buildToggle(toggle_spec, $attachto) {
        if (is_jqm) {
            var f1 = '<select data-role="flipswitch" data-mini="true" name="turboMode-select" id="turboMode-select"> <option value="off">Off</option> <option value="on" selected>On</option> </select>';
            $attachto.append(f1);

            for (var i = 0; i < 5; i++) {
                $attachto
                    .append('<select data-role="flipswitch" data-mini="true" id="abcfs1' + i + '"> <option value="off">Off</option> <option value="on" selected>On</option> </select>');
            }
            for (var i = 0; i < 5; i++) {
                $attachto
                    .append('<div class="ui-field-contain"><label for="axbcfs1' + i + '">Flip:</label><select data-role="flipswitch" data-mini="true" id="axbcfs1' + i + '"> <option value="off">Off</option> <option value="on" selected>On</option> </select></div>');
            }
            for (var i = 0; i < 5; i++) {
                $attachto
                    .append('<label><input type="checkbox" data-mini="true" id="checkbox ' + i + '" />Checkbox' + i + '</label>')
            }
        }
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
        var element1 = buildSlider(btb[i], _custom_keys_page);
        var element2 = buildToggle(btb[i], _custom_keys_page);
        _custom_keys_page.trigger( "create" );  // tell jqm to style all the widgets

    }

    return {
        rebuildAllButtons: rebuildAllButtons,
    }

};
