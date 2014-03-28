var util = require("util")
var widgetUtil = require('../lib/widget_util.js');

exports.show = function (req, res) {
  
	var async = require('async');
	if (!req.session.widget) {
	req.session.messages = { errors: ['widget not found'] };
	res.redirect('/');
	return;
	}

	widgetUtil.render_widget(req.session.widget, function (err, w_html) {
	 	var widget = req.session.widget;

		if(err){
			console.log("Failed to render html: ", err);
			widget.html = "Failed to render html: " + err;
			req.session.messages = { errors: ["Failed to render: " + err]}

		}else{
			//console.log("Rendered widget===================== " + w_html)
		 	widget.html = w_html
		
		}
		var data = {
		    username: req.session.user.username,
		    title  : 'Widget : ' + widget.name,
		    widget : widget,
		    screens: req.session.screens,
        	widgets: req.session.widgets

		};	
		res.render('widgets/show', data);

	});


};
exports.new = function (req, res) {
  var data = {
      username: req.session.user.username,
      title: 'Widget : New',
      screens: req.session.screens,
      widgets:req.session.widgets
    };
  res.render('widgets/new', data);
};
exports.create = function (req, res) {
	var formData = req.body;

	var t_widget = {
		name: formData.name,
	 	url: formData.fetch_url,
	 	data_template: formData.data_template,
	 	pre_data: formData.pre_data,
	 	post_data: formData.post_data,
	 	validation_schema: formData.data_schema,
	 	repr_scheme:  formData.repr_scheme,
	 	refreshInterval: parseInt(formData.update_freq)
	 }
	
	switch( formData.repr_scheme){
		case "Table":
			t_widget.repr_setting = {
				columns: [],
				showRowNumber: !parseInt(formData.hideRowNumber)
			}
			try{
				formData.table_cols.split(";").forEach( function(colStr){
					var col = colStr.split(":")
					t_widget.repr_setting.columns.push( 
						{	name: col[0].trim(),  type: col[1].trim()	}
					);		
				})
			}catch(e){
				console.log("Unsupported representational scheme setting");
				req.session.messages = { errors: ["Unsupported representational scheme setting"]}
				res.redirect("/widgets/new")	
				return;		
			}

			break;
		default:
			console.log("Unsupported representational scheme");
			req.session.messages = { errors: ["Unsupported representational scheme"] }
			res.redirect("/widgets/new")
			return;
	}

	console.log( "Widget To Save: %j", t_widget);
	var Widget = require('../models/widget');


	Widget.save( t_widget, function(err, screen){
		if(!err){
			console.log('Widget created successfully');
			req.session.messages = {
			  success: ['Widget(' + t_widget.name + ') created successfully'],
			  errors: []
			};
			res.redirect('/');
			return;
		}else{
			console.log('Failed to create screen: ',err);
			req.session.messages = { validationErrors: err };
			res.redirect('widgets/new');
			return;
		}
	});  
};



exports.load_widget = function (id, params) {

};


//TODO 
// DO NOT DELETE IF USED IN SCREENS
exports.delete = function (req, res) {
  if (!req.session.widget) {
    req.session.messages = { errors: ['widget not found'] };
  } else {
    var Widget = require('../models/widget');
    Widget.destroy(req.session.widget, function(err){
  		if(err){
  			util.log("Failed to delete screen "+err);
  			req.session.messages = { errors: ['Failed to delete screen. ' + err] };
  		}else{
  			util.log("Widget deleted successfully");
  			req.session.messages = { success: ['Widget ' + req.session.widget.name + ' deleted successfully'] };
  			req.session.widget = null;
  		}
  		  res.redirect('/');
  		  return;
	  });
  }

};