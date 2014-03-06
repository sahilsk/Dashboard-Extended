

exports.new  = function(req, res){
	var data = {
		username: req.session.user.username,
		title:"Screen : Create New"
	}	;
	res.render("screens/new", data	);

}

exports.create = function(req, res){
	
	//Deny direct post request
	if( !req.body.hasOwnProperty("screen_name") || !req.body.hasOwnProperty("screen_desc") ){
		res.status(401);
		res.send('Unauthorized Access <a href=\'/screens/new\'>Create New Screen</a> ');
		return;
	}

	//Validate input fields
	if( !req.body.screen_name.length ){
		var errors = {"screen_name": "Should not be empty."};
		res.render("screens/new", errors);
		return;
	}

	//Create new screen
	var t_screen = {name:req.body.screen_name, desc: req.body.screen_desc};
	var Screen = require("../models/screen");
	if( Screen.save( t_screen ) ){
		console.log("Screen created successfully");
		req.session.messages = {	
			success: ["Screen("+t_screen.name +") created successfully" ],
			errors:[]
		 };
		res.redirect("/");
		return;

	}else{
		console.log("Failed to create screen: ", Screen.errors.join() );
		var errors = {"screen_name":  Screen.errors.join() };
		res.render("screens/new", errors);		
		return;
	}
	



}