
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
      data.rpnstack = rpn;
      data.log = log_f;

      jsparser.execute(data);
  }

  function clearButtons() {
      $("#customKeysPage").html('');
  }
  
  // PUBLIC

  function rebuildAllButtons() {
      var btb = jsparser.parse();  // btb means buttons_to_build
      clearButtons();  // Clear old buttons
      for (var i=0; i < btb.length; i++) {
          var element = buildButton(btb[i], $('#customKeysPage'));
          element.data('cmd', { function_to_call : btb[i].function_name,
                                params : btb[i].params });
      }
  }
  
  return {
    rebuildAllButtons:rebuildAllButtons,
  }

};
