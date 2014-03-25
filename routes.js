var welcome = require('./controllers/welcome');
var session = require('./controllers/sessions');
var screen = require("./controllers/screens");
var widget = require("./controllers/widgets");


var authMWare = require("./lib/auth_middleware");
var screenMWare = require("./lib/screen_middleware");
var widgetMWare = require("./lib/widget_middleware");



module.exports = function(app){

	app.get('/', [authMWare.isLoggedIn, screenMWare.all ],  welcome.index);

//AUTHORIZATION
	app.get("/login", session.index);
	app.post("/auth", session.auth);
	app.get("/logout", authMWare.isLoggedIn, session.logout);

//SCREENS: CREATE, EDIT, DELETE, UPDATE
	app.get('/screens/new', [authMWare.isLoggedIn, screenMWare.all], screen.new);
	app.post('/screens/create', [authMWare.isLoggedIn,screenMWare.all], screen.create);
	app.get('/screens/:id', [authMWare.isLoggedIn,screenMWare.all, screenMWare.fetchScreen ], screen.show);
	app.del('/screens/:id', [authMWare.isLoggedIn], screen.delete);


//WIDGETS: CREATE, EDIT, DELETE, UPDATE
	app.get('/widgets/new', [authMWare.isLoggedIn, screenMWare.all], widget.new);
	app.post('/widgets/create', [authMWare.isLoggedIn, screenMWare.all], widget.create);
	app.get('/widgets/:id', [authMWare.isLoggedIn, widgetMWare.fetchWidget, screenMWare.all ], widget.show);
} 

