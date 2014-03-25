var _ = require("underscore");
var util = require("util");


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
  var arr_widgetHTML = [];

  var widgetUtil = require('../lib/widget_util.js');

  async.each(screen.widgets, function (widget, cb) {
  	console.log( "Screen Widget: " + widget);
    widgetUtil.render_widget(widget, function (err, w_html) {
      if(!err)
        arr_widgetHTML.push(w_html);
      else{
        console.log("Failed to render widget " +  widget.id  + " : "+  err);
      }
      cb(null);
    });
  }, function (err) {

    req.session.screen.widgets = arr_widgetHTML;

    var data = {
        username: req.session.user.username,
        title: 'Screen : '+req.session.screen.name,
        screens: req.session.screens,
        widgets: req.session.widgets,
        screen: req.session.screen
      };

    res.render('screens/show', data);
  });


};
exports.new = function (req, res) {
  var data = {
      username: req.session.user.username,
      title: 'Screen : Create New',
      screens: req.session.screens
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
      description: req.body.screen_desc,
	    widgets : []
    };
  var Screen = require('../models/screen');
 
  //Create new screen
	Screen.save( t_screen, function(err, screen){
		if(!err){
			console.log('Screen created successfully');
			req.session.messages = {
			  success: ['Screen(' + t_screen.name + ') created successfully'],
			  errors: []
			};
			res.redirect('/screens/'+screen.id);
			return;
		}else{
			console.log('Failed to create screen: ',err);
			req.session.messages = { validationErrors: err };
			res.redirect('screens/new');
			return;
		}
	});
};

exports.addWidget = function(req, res){


}


exports.removeWidget = function(req, res){
	

};

exports.delete = function (req, res) {
  if (!req.session.screen) {
    req.session.messages = { errors: ['screen not found'] };
  } else {
    var Screen = require('../models/screen');
    Screen.destroy(req.session.screen, function(err){
  		if(err){
  			util.log("Failed to delete screen "+err);
  			req.session.messages = { errors: ['Failed to delete screen. ' + err] };
  		}else{
  			util.log("Screen deleted successfully");
  			req.session.messages = { success: ['Screen ' + req.session.screen.name + ' deleted successfully'] };
  			req.session.screen = null;
  		}
  		  res.redirect('/');
  		  return;
	  });
  }

};