/*
 * Mushpup-UI Tests
 */
(function() {
  module('Mushpup-UI module');

  test('should load Mushpup-UI module and verify version', function() {
    var ui = MushpupUI();
    ok(MushpupUI);
    ok(ui);
    equal(ui.version(), '2.0');
  });
})();

(function() {
  var ui;

  module('Mushpup-UI DOM initialization', {
    setup: function() {
      ui = MushpupUI();
    },

    teardown: function() {
      ui = null;
    }
  });

  test('should display mushpup root element', function() {
    equal($('div#qunit-fixture').length, 1);
    equal($('div.mushpup').length, 0);
    ui.init('div#qunit-fixture');
    equal($('div.mushpup').length, 1);
  });

  test('should display mushpup input panel', function() {
    equal($('div.input-panel').length, 0);
    equal($('div.form-group.locus').length, 0);
    equal($('div.form-group.pocus').length, 0);
    equal($('div.form-group.confirmation').length, 0);

    ui.init('div#qunit-fixture');

    equal($('div.input-panel').length, 1, 'div.input-panel not loaded');
    equal($('div.form-group.locus').length, 1, 'locus form group not loaded');
    equal($('div.form-group.pocus').length, 1, 'pocus form group not loaded');
    equal($('div.form-group.pocus-confirm').length, 1, 'pocus-confirm form group not loaded');
    ok($('div.form-group.pocus-confirm').hasClass('rolled-up'));
  });

  test('should display mushpup action panel', function() {
    equal($('div.action-panel').length, 0);
    equal($('span.action.confirm').length, 0);
    equal($('span.action.mush').length, 0);
    equal($('span.action.reset').length, 0);

    ui.init('div#qunit-fixture');

    equal($('div.action-panel').length, 1, 'div.action-panel not loaded');
    equal($('span.action.confirm').length, 1, 'confirm action not loaded');
    equal($('span.action.confirm span.button').text(), 'confirm');
    equal($('span.action.mush').length, 1, 'mush action not loaded');
    equal($('span.action.reset').length, 1, 'reset action not loaded');
    equal($('span.action.reset span.button').text(), 'reset');
    ok($('div.form-group.pocus-confirm').hasClass('rolled-up'));
  });

  test('should display mushpup output panel', function() {
    equal($('div.output-panel').length, 0);
    equal($('div.alerts').length, 0);
    equal($('div.payload').length, 0);
    equal($('div.upper.ruler span.c').length, 0);
    equal($('div.lower.ruler span.c').length, 0);

    ui.init('div#qunit-fixture');

    equal($('div.output-panel').length, 1, 'div.output-panel not loaded');
    equal($('div.alerts').length, 1, 'alerts block not loaded');
    equal($('div.payload').length, 1, 'payload block not loaded');
    equal($('div.upper.ruler span.c').length, 24, 'upper ruler not loaded');
    equal($('div.lower.ruler span.c').length, 24, 'lower ruler not loaded');
  });
})();