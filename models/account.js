

user = {

	"id" : 134343,
	"username" : "admin",
	"email":"admin@gmail.com",
	"password":"admin"
}


exports.authenticate =  function(req, email, password, done) {
	if( user.email === email && user.password === password){
		return done(null, user);
	}else
		return done(null, false);
}


exports.serializeUser  = function(user, done) {
        done(null, user.id);
};

exports.deserializeUser = function(id, done) {
        done(null, user);
};
