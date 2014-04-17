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
//            element.attr('class', "ui-mini ui-btn-inline");
//            element.slider(); // give jqm a chance to style it.
            $attachto.append(element);
        }
    }

    function buildToggle(toggle_spec, $attachto) {
        if (is_jqm) {
            var toggle_button = '<select id="flip-b" data-role="slider"><option value="off">Off</option>   <option value="on">On</option></select>';
            $attachto.append(toggle_button);
//            $('select').slider();  //call plugin function here
            $("#flip-b").slider();  //call plugin function here
//            $("#flip-b").slider('refresh');  //call plugin function here
//            $("#flip-b").val('on').slider('refresh');

            var f1 = $('<select data-role="flipswitch" data-mini="true" name="turboMode-select" id="turboMode-select"> <option value="off">Off</option> <option value="on" selected>On</option> </select>');
            $attachto.append(f1);
            f1.trigger('create');
            $attachto.trigger( "create" );
//            $attachto.trigger( "updatelayout" );
//            $( "#turboMode-select" ).flipswitch({ corners: false });
//            $("#turboMode-select").flipswitch( "refresh" );
            f1.flipswitch( "refresh" );
//            $("#turboMode-select").val('on').slider('refresh');

//            var t2 = '<input type="checkbox" data-role="flipswitch" name="flip-checkbox" id="flip-checkbox">'
//            $attachto.append(t2);
//            $("#flip-checkbox").val('no').slider('refresh');

//            var str="<div data-role='fieldcontain' style='width: 50%'><label for='flipswitch'>Volume:</label>"
//                + "<select name='flipswitch' id='flipswitch' data-role='slider' data-track-theme='d'>"
//                + "<option value='no'>Offfffffff</option><option value='yes'>Onnnnnnnnnnn</option></select></div>"
//                + "<div id='volcontainer' data-role='fieldcontain' style='width: 100%'>"
//                + "<input type='range' name='volume' id='volume' value='8' min='0' max='15' data-track-theme='b' disabled /></div>";
//              $attachto.html(str).trigger('create');


//            var element = $('<form>'+
//                                '<label for="flip-3">Flip toggle switch:</label>' +
//                                '<select name="flip-3" id="flip-3" data-role="flipswitch" data-mini="true">' +
//                                '<option value="off">Off</option>' +
//                                '<option value="on">On</option>' +
//                                '</select>'+
//                            '</form>');
//            element.attr('class', "ui-mini ui-btn-inline");
//            element.slider(); // give jqm a chance to style it.
//            $attachto.append(element);
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
        var element = buildSlider(btb[i], _custom_keys_page);
        var element = buildToggle(btb[i], _custom_keys_page);
    }

    return {
        rebuildAllButtons: rebuildAllButtons,
    }

};
