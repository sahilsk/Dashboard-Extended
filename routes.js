var welcome = require('./controllers/welcome');
var session = require('./controllers/sessions');

var authMWare = require("./lib/auth_middleware");

module.exports = function(app){


	app.get('/', authMWare.isLoggedIn,  welcome.index);

	app.get("/login", session.index);
	app.post("/auth", session.auth);

	app.get("/logout", session.logout);

} 

