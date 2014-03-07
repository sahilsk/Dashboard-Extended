var welcome = require('./controllers/welcome');
var session = require('./controllers/sessions');
var screen = require("./controllers/screens");
var widget = require("./controllers/widgets");


var authMWare = require("./lib/auth_middleware");
var screenMWare = require("./lib/screen_middleware");


module.exports = function(app){


	app.get('/', authMWare.isLoggedIn,  welcome.index);

//AUTHORIZATION
	app.get("/login", session.index);
	app.post("/auth", session.auth);
	app.get("/logout", session.logout);

//SCREENS: CREATE, EDIT, DELETE, UPDATE
	app.get('/screens/new', authMWare.isLoggedIn, screen.new);
	app.post('/screens/create', authMWare.isLoggedIn, screen.create);
	app.get('/screens/:id', [authMWare.isLoggedIn,screenMWare.fetchScreen], screen.show);
	app.del('/screens/:id', [authMWare.isLoggedIn,screenMWare.fetchScreen], screen.delete);


//WIDGETS: CREATE, EDIT, DELETE, UPDATE
	app.get('/widgets/new', authMWare.isLoggedIn, widget.new);
	app.post('/widgets/create', authMWare.isLoggedIn, widget.create);
	app.get('/widgets/:id', [authMWare.isLoggedIn,screenMWare.fetchScreen], widget.show);	


} 

