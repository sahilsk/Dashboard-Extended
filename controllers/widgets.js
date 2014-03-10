

exports.show = function(req, res){

	res.send("W.I.P");
}

exports.new  = function(req, res){
	var data = {
		username: req.session.user.username,
		title:"Widget : New",
		screens:require("../models/screen.js").all(),
		widgets:require("../models/widget.js").all()
	}	;
	res.render("widgets/new", data	);
}


exports.create = function(req, res){
	
	//Deny direct post request


	//Validate Input params



	//Create new screen

	res.send("W.I.P");

}

exports.load_widget = function(id, params){




}