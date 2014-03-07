/*******************
Name: fetchScreen
Description: Load screen object
*******************/



exports.fetchScreen = function(req, res, next){
	var Screen = require("../models/screen");
	var tScreen = Screen.find(req.params.id);
	if( tScreen.length >0){
		//get all widgets
		var Widget =  require("../models/widget");
		var widgets = [];
		var screen  = tScreen[0];
		console.log(screen);
		screen.widgets.forEach(function(wid){
			if(typeof(wid) != "object")
				widgets.push( Widget.find(wid)[0] );
			else
				widgets.push( wid );
		});
		screen.widgets =widgets;
		console.log( screen.widgets);

		req.session.screen =screen;
	}else{
		req.session.screen = null;
	}
	next();
	
}