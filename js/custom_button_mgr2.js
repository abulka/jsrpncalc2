
function CustomButtonsMgr(jsparser, persister, clicksound, log_f, rpn)  // should be better ways to pass these
{
//  // PRIVATE

  function buttonBuilder(params, $attachto) {
      // console.log('buttonBuilder, params=', params);
      var element = $('<a>'+params['function_name']+'</a>');
      element.attr('data-role', "button").attr('data-mini', true).attr('data-inline', true).attr('data-theme', "a");
//      element.button(); // give jqm a chance to style it.

      //element.on('vmousedown', function() { clicksound.play(); });  // click sound during carousel swipe is confusing, so don't do it.

      element.on("click dblclick", doclickeval);  // Wire up event handler for our new custom button.
                                                  // Note we don't listen for swipe, since custom buttons on the carousel
                                                  // are likely to be swiped and the intent is for the carousel to move
      $attachto.append(element);
      console.log('buttonBuilder built element:', element);
      return element;
  }

  function doclickeval(event) {
      console.log('doclickeval this', this);
      jsparser.execute_function_from_button_info({
//          'function_to_call': $(this).find('.ui-btn-text').text(), // button text nested a within a few spans in jqm
          'function_to_call': $(this).data("function_name"),
          // go off button name for now
          'num_params': $(this).data("num_params"),
          // custom attr for any dom element - see http://api.jquery.com/jQuery.data/
          'params': $(this).data("params"),
          'rpnstack': rpn,
          'log': log_f
      });
  }

  function clear_custom_buttons() {
      $("#customKeysPage").html('');
  }
  
  // PUBLIC

  function rebuild_custom_buttons() {
      var first_time = false;
      
      jsparser.editor.setValue(persister.get_editor_text());
      
      var btb = jsparser.parse();
      //console.log('btb', btb);

      // Re-Build buttons
      
      clear_custom_buttons();   // Clear old buttons from swipe carousel

      for (var i=0; i < btb.length; i++) {
          var current_function = btb[i].function_name;
          
          var element = buttonBuilder(btb[i], $('#customKeysPage'));
          element.data("function_name", current_function);  //function name - don't trust button text
          element.data("num_params", btb[i].num_params);  // Add custom data to the button re what function it represents
          element.data("params", btb[i].params);          // and what parameters that function takes.
          console.log('buttonBuilder AUGMENTED element with params info:', element);

      }
  }
  
  // Return interface -----------------------

  return {
    rebuild_custom_buttons:rebuild_custom_buttons,
  }

};
