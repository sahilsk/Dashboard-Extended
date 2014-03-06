
/*
 * GET home page.
 */

exports.index = function(req, res){

	var user = req.session.user;
	var Screen = require("../models/screen.js");


	 res.render('sessions/welcome', { title: 'Dashboard ', username:user.username, screens:Screen.all() });
};


