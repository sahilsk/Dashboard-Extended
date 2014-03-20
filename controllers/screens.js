exports.show = function (req, res) {
  var async = require('async');
  if (!req.session.screen) {
    req.session.messages = { errors: ['screen not found'] };
    res.redirect('/');
    return;
  }
  var Handlebars = require('../hbs_helpers/hbs_helpers.js');
  var fs = require('fs');
  var JSONParse = require('json-literal-parse');
  var screen = req.session.screen;
  var widgets = [];
  var arr_widHTML = [];
  var widgetUtil = require('../lib/widget_util.js');
  async.each(screen.widgets, function (w, cb) {
    widgetUtil.render_widget(w, function (w_html) {
      arr_widHTML.push(w_html);
      cb(null);
    });
  }, function (err) {
    console.log(arr_widHTML[0]);
    var data = {
        username: req.session.user.username,
        title: 'Screen : ',
        widgets: arr_widHTML,
        screens: require('../models/screen.js').all(),
        screen: req.session.screen
      };
    res.render('screens/show', data);
  });
};
exports.new = function (req, res) {
  var data = {
      username: req.session.user.username,
      title: 'Screen : Create New',
      screens: require('../models/screen.js').all()
    };
  res.render('screens/new', data);
};
exports.create = function (req, res) {
  //Deny direct post request
  if (!req.body.hasOwnProperty('screen_name') || !req.body.hasOwnProperty('screen_desc')) {
    res.status(401);
    res.send('Unauthorized Access <a href=\'/screens/new\'>Create New Screen</a> ');
    return;
  }
  var t_screen = {
      name: req.body.screen_name,
      desc: req.body.screen_desc
    };
  var Screen = require('../models/screen');
  //Validate Input params
  if (!Screen.validate(t_screen)) {
    req.session.messages = { errors: Screen.errors };
    res.redirect('screens/new');
    return;
  }
  //Create new screen
  if (Screen.save(t_screen)) {
    console.log('Screen created successfully');
    req.session.messages = {
      success: ['Screen(' + t_screen.name + ') created successfully'],
      errors: []
    };
    res.redirect('/');
    return;
  } else {
    console.log('Failed to create screen: ', Screen.errors.join());
    req.session.messages = { errors: Screen.errors };
    res.redirect('screens/new');
    return;
  }
};
exports.delete = function (req, res) {
  if (!req.session.screen) {
    req.session.messages = { errors: ['screen not found'] };
  } else {
    var Screen = require('../models/screen');
    Screen.destroy(req.session.screen);
    req.session.messages = { success: ['Screen ' + req.session.screen.name + ' deleted successfully'] };
    req.session.screen = null;
  }
  res.redirect('/');
  return;
};