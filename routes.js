var welcome = require('./controllers/welcome');
var session = require('./controllers/sessions');
var screen = require("./controllers/screens");

var authMWare = require("./lib/auth_middleware");

module.exports = function(app){


	app.get('/', authMWare.isLoggedIn,  welcome.index);

//AUTHORIZATION
	app.get("/login", session.index);
	app.post("/auth", session.auth);
	app.get("/logout", session.logout);

//SCREENS: CREATE, EDIT, DELETE, UPDATE
	app.get('/screens/new', authMWare.isLoggedIn, screen.new);
	app.post('/screens/create', authMWare.isLoggedIn, screen.create);



} 

