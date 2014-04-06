
function CustomButtonsMgr(jsparser, clicksound, log_f, rpn)  // should be better ways to pass these
{
//  // PRIVATE

  function buildButton(params, $attachto) {
      // console.log('buildButton, params=', params);
      var element = $('<a>'+params['function_name']+'</a>');
      element.attr('data-role', "button").attr('data-mini', true).attr('data-inline', true).attr('data-theme', "a");
//      element.button(); // give jqm a chance to style it.

      //element.on('vmousedown', function() { clicksound.play(); });  // click sound during carousel swipe is confusing, so don't do it.

      element.on("click dblclick", onClickDoExecute);  // Wire up event handler for our new custom button.
                                                  // Note we don't listen for swipe, since custom buttons on the carousel
                                                  // are likely to be swiped and the intent is for the carousel to move
      $attachto.append(element);
      console.log('buildButton built element:', element);
      return element;
  }

  function onClickDoExecute(event) {
      var data = {};
      $.extend(data, $(this).data('cmd'));
//      data.function_to_call = $(this).data("function_name");
//      data.num_params = $(this).data("num_params");
//      data.params = $(this).data("params");
      data.rpnstack = rpn;
      data.log = log_f;

      jsparser.execute(data);
  }

  function clearButtons() {
      $("#customKeysPage").html('');
  }
  
  // PUBLIC

  function rebuildAllButtons() {
      var buttons_to_build = jsparser.parse();
      var btb = buttons_to_build;
      //console.log('btb', btb);

      clearButtons();   // Clear old buttons

      for (var i=0; i < btb.length; i++) {
          var cmd = {};
          cmd.function_to_call = btb[i].function_name;
          cmd.num_params = btb[i].num_params;
          cmd.params = btb[i].params;
          var element = buildButton(btb[i], $('#customKeysPage'));
          element.data('cmd', cmd);
//          var current_function = btb[i].function_name;
//
//          element.data("function_name", current_function);  //function name - don't trust button text
//          element.data("num_params", btb[i].num_params);  // Add custom data to the button re what function it represents
//          element.data("params", btb[i].params);          // and what parameters that function takes.
//
      }
  }
  
  return {
    rebuildAllButtons:rebuildAllButtons,
  }

};
