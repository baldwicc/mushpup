/*
 * Mushpup-UI Module
 *
 * Requires jQuery, jQuery-UI
 *
 */
var MushpupUI = (function() {

  var VERSION = '2.0';

  // Constants
  var MUSH_TIMEOUT = 15;  // seconds
  var RESET_TIMEOUT = 60;

  // Globals
  var unmushTimer;
  var resetTimer;

  var init = function(selector) {
    var $selectedElement = $(selector);
    var $mushpupInterface = buildInterface();
    $selectedElement.append($mushpupInterface);

    prepareRuler();
    enableHandlers($selectedElement);
  };

  var buildInterface = function() {
    var $mushpupInterface = $('<div class="mushpup" />');
    var $inputPanel = buildInputPanel();
    var $actionPanel = buildActionPanel();
    var $outputPanel = buildOutputPanel();

    $mushpupInterface
      .append($inputPanel)
      .append($actionPanel)
      .append($outputPanel);

    return $mushpupInterface;
  };

  var prepareRuler = function() {
    var upperRuler = '>***5****0****5****0***>';
    var lowerRuler = '<***0****5****0****5***<';
    var groups = ['west', 'central', 'east'];
    var $upperRuler = $('div.upper.ruler');
    var $lowerRuler = $('div.lower.ruler');

    // Build groups of ruler characters
    jQuery.each(groups, function(n, group) {
      var $upperGroup = $('<span />').addClass('upper group ' + group);
      var $lowerGroup = $('<span />').addClass('lower group ' + group);

      for (var i=0; i < 8; i++) {
        var index = n * 8 + i;
        var upperChar = upperRuler[index].replace('*', '&bull;');
        var lowerChar = lowerRuler[index].replace('*', '&bull;');
        var $upperSpan = $('<span />').addClass('c').html(upperChar);
        var $lowerSpan = $('<span />').addClass('c').html(lowerChar);
        $upperGroup.append($upperSpan);
        $lowerGroup.append($lowerSpan);
      }

      $upperRuler.append($upperGroup);
      $lowerRuler.append($lowerGroup);
    });
  };

  var enableHandlers = function() {
    prepareMushButtonHandler();
    prepareResetButtonHandler();
    prepareConfirmButtonHandler();
  };

  /*
   * DOM Builders
   */
  var buildInputPanel = function() {
    var $inputPanel = $('<div class="input-panel" />');
    var $form = $('<form />');
    var $fieldset = $('<fieldset />');

    var $locusGroup = buildLocusFormGroup();
    var $pocusGroup = buildPocusFormGroup();
    var $pocusConfirmGroup = buildPocusConfirmFormGroup();

    $fieldset
      .append($locusGroup)
      .append($pocusGroup)
      .append($pocusConfirmGroup);

    $form.append($fieldset);

    $inputPanel.append($form);

    return $inputPanel;
  };

  var buildActionPanel = function() {
    var $actionPanel = $('<div class="action-panel" />');

    var $confirmAction = buildCircleAction('confirm');
    var $mushAction = buildMushAction();
    var $resetAction = buildCircleAction('reset');

    $actionPanel
      .append($confirmAction)
      .append($mushAction)
      .append($resetAction);

    return $actionPanel;
  };

  var buildOutputPanel = function() {
    var $outputPanel = $('<div class="output-panel" />');

    var $alertsBlock = buildAlertsBlock();
    var $payloadBlock = buildPayloadBlock();

    $outputPanel
      .append($alertsBlock)
      .append($payloadBlock);

    return $outputPanel;
  };

  var buildLocusFormGroup = function() {
    var $locusGroup = $('<div class="form-group locus" />');
    var $input = $('<input type="text" id="locus" class="form-control" autofocus />');
    var $p = $('<p class="hidden warn warn-locus" />');

    $input.attr('placeholder', 'site (e.g. yahoo.com)');

    $locusGroup.append($input).append($p);
    return $locusGroup;
  };

  var buildPocusFormGroup = function() {
    var $pocusGroup = $('<div class="form-group pocus" />');
    var $input = $('<input type="password" id="pocus" class="form-control" />');
    var $p = $('<p class="hidden warn warn-pocus" />');

    $input.attr('placeholder', 'mushpup secret word');

    $pocusGroup.append($input).append($p);
    return $pocusGroup;
  };

  var buildPocusConfirmFormGroup = function() {
    var $pocusConfirmGroup = $('<div class="form-group rolled-up pocus-confirm" />');
    var $input = $('<input type="password" id="pocus-confirm" class="form-control" />');
    var $p = $('<p class="hidden warn warn-pocus-confirm" />');

    $input.attr('placeholder', 'confirm secret word');

    $pocusConfirmGroup.append($input).append($p);
    return $pocusConfirmGroup;
  };

  var buildCircleAction = function(action) {
    var $actionSpan = $('<span class="action" />').addClass(action);
    var $buttonSpan = $('<span class="circle button" />').addClass(action).text(action);

    $actionSpan.append($buttonSpan);
    return $actionSpan
  };

  var buildMushAction = function() {
    var $mushSpan = $('<span class="action mush" />');
    var $mushButton =
      $('<button type="submit" />')
        .text('mush')
        .addClass('btn btn-lg btn-primary btn-block mush');

    $mushSpan.append($mushButton);
    return $mushSpan;
  };

  var buildAlertsBlock = function() {
    var $alertsBlock = $('<div class="alerts" />');
    var $helpAlerts = $('<div class="help-alerts" />');
    var $errorAlerts = $('<div class="error-alerts" />');
    var $warningAlerts = $('<div class="warning-alerts" />');

    $alertsBlock
      .append($helpAlerts)
      .append($errorAlerts)
      .append($warningAlerts);

    return $alertsBlock;
  };

  var buildPayloadBlock = function() {
    var $payloadBlock = $('<div class="payload" />');
    var $upperRuler = $('<div class="upper ruler" />');
    var $hash = $('<div class="hash" />');
    var $lowerRuler = $('<div class="lower ruler" />');

    $payloadBlock
      .append($upperRuler)
      .append($hash)
      .append($lowerRuler);

    return $payloadBlock;
  };

  /*
   * Event Handlers
   */
  var prepareMushButtonHandler = function() {
    $('button.mush').data('form-open', true);
    $('button.mush').on('click', function() {
      var ok = false;

      if ( formIsOpen() ) {
        ok = onMush();
      }
      else {
        ok = onUnmush();
      }

      if ( ok ) {
        toggleForm();
      }

      return false;
    });
  };

  var prepareResetButtonHandler = function() {
    $('span.button.reset').on('click', function() {
      resetForm();
    });
  };

  var prepareConfirmButtonHandler = function() {
    $('span.button.confirm').on('click', function() {
      toggleConfirmField();
    });
  };

  var formIsOpen = function() {
    return !!($('button.mush').data('form-open'));
  };

  var onMush = function() {
    // Validate confirm field if present
    var confirmFieldIsPresent = $("div.pocus-confirm").is(":visible");

    if ( confirmFieldIsPresent ) {
      var pocus = $('input#pocus').val().trim();
      var confirmation = $('input#pocus-confirm').val().trim();

      if ( pocus !== confirmation ) {
        alert("Your mushpup secret words didn't match. Please carefully re-enter them.");
        return false;
      }
    }

    // Generate hash
    var hash = generateHash();
    validateInput();
    updateHash(hash);
    $('button.mush').text('unmush');

    // Unmush after given period of time
    clearTimeout(unmushTimer);
    unmushTimer = setTimeout(function() {
      $('button.mush').click();
    }, MUSH_TIMEOUT * 1000);

    // Reset form completely after given period of time
    restartResetTimer();

    return true;
  };

  var onUnmush = function() {
    clearTimeout(unmushTimer);
    clearPayload();
    restartResetTimer();
    return true;
  };

  var toggleForm = function() {
    $('div.input-panel fieldset').slideToggle('slow');
    $('div.output-panel').slideToggle('slow', swapFormState);
  };

  var generateHash = function() {
    var locus = $('input#locus').val().trim();
    var pocus = $('input#pocus').val().trim();
    return Mushpup.mush(locus, pocus);
  };

  var validateInput = function() {
    var $warnings = $('div.alerts div.warning-alerts');
    var site = $('input#locus').val().trim();
    var msw = $('input#pocus').val().trim();

    // Clear any warning
    $warnings.empty();

    // Add any new warnings
    var addWarning = function(message, style) {
      style = (! style) ? 'warning' : style;
      var alertClass = 'alert alert-dismissible alert-' + style;
      var $button = $([
        '<button type="button" class="close" data-dismiss="alert">',
        '<span aria-hidden="true">&times;</span>',
        '<span class="sr-only">Close</span>',
        '</button>'].join('\n'));
      var $messageSpan = $('<span />').text(message);
      var $alert = $('<div role="alert" />')
        .addClass(alertClass)
        .append($button)
        .append($messageSpan);
      $warnings.append($alert);
    }

    if ( ! site ) {
      addWarning('Site field was empty');
    }

    if ( ! msw ) {
      addWarning('Mushpup Secret Word field was empty')
    }
  };

  var updateHash = function(hashCode) {
    var groups = ['west', 'central', 'east'];
    var hashCodeLetters = hashCode.split('');

    // Empty hash row
    var $hashRow = $('div.output-panel div.hash');
    $hashRow.empty();

    // Build groups of ruler characters
    jQuery.each(groups, function(n, group) {
      var $hashGroup = $('<span />').addClass('group ' + group);

      for (var i=0; i < 8; i++) {
        var index = n * 8 + i;
        var letter = hashCodeLetters[index];
        var $letterSpan = $('<span />').addClass('c').text(letter);
        $hashGroup.append($letterSpan);
      }

      $hashRow.append($hashGroup);
    });
  };

  var restartResetTimer = function() {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function() {
      resetForm();
    }, RESET_TIMEOUT * 1000);
  };

  var clearPayload = function() {
    $('button.mush').text('mush');
    var hash = '------------------------'.replace(/-/g, '•');
    updateHash(hash);
  };

  var swapFormState = function() {
    $('button.mush').data('form-open', !(formIsOpen()));
  };

  var resetForm = function() {
    clearTimeout(unmushTimer);
    clearTimeout(resetTimer);
    clearPayload();
    clearInputFields();
    var formIsVisible = showForm();

    $.when(formIsVisible).then(function() {
      rollupConfirmField();
      $('input#locus').focus();
    });
  };

  var clearInputFields = function() {
    $('input#locus').val('');
    $('input#pocus').val('');
    $('input#pocus-confirm').val('');
  };

  var showForm = function() {
    $('div.input-panel fieldset').slideDown('slow', function() {
      $('button.mush').data('form-open', true);
    });
    $('div.output-panel').slideUp('slow');

    // Returns promise that can be used for callback when form present
    var formIsVisible = $('div.input-panel fieldset').promise();
    return formIsVisible;
  };

  var toggleConfirmField = function() {
    $('div.pocus-confirm').slideToggle('slow', function() {
      if ( $("div.pocus-confirm").is(":visible") ) {
        $('input#pocus-confirm').focus();
      }
    });
  };

  var rollupConfirmField = function() {
    if ( $("div.pocus-confirm").is(":visible") ) {
      toggleConfirmField();
    }
  };

  /*
   * Public Interface
   */
  var API = {
    init: init,
    version: function() { return VERSION; }
  };
  return API;
});