/*******************
Name: fetchScreen
Description: Load screen object
*******************/



exports.fetchScreen = function(req, res, next){
	var Screen = require("../models/screen");
	var tScreen = Screen.find(req.params.id);
	if( tScreen.length >0){
		req.session.screen = tScreen[0];
	}else
		req.session.screen = null;
	next();
	
}