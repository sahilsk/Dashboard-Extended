/*******************
Name: Authenticate
Description: Provide user authentication and role control over resources
*******************/



exports.authenticate = function(username, password){


}


exports.isLoggedIn = function(req, res, next){

	if( req.session && req.session.user ){
		next();
	}else{
		req.session.messages = ["Unauthorized Access. Please login first."];
		res.redirect("/login");
	}
}