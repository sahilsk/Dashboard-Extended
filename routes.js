var welcome = require('./controllers/welcome');
var session = require('./controllers/sessions');
var screen = require("./controllers/screens");
var widget = require("./controllers/widgets");


var authMWare = require("./lib/auth_middleware");
var screenMWare = require("./lib/screen_middleware");
var widgetMWare = require("./lib/widget_middleware");



module.exports = function(app){

	app.get('/', [authMWare.isLoggedIn, widgetMWare.all, screenMWare.all ],  welcome.index);

//AUTHORIZATION
	app.get("/login", session.index);
	app.post("/auth", session.auth);
	app.get("/logout", authMWare.isLoggedIn, session.logout);

//SCREENS: CREATE, EDIT, DELETE, UPDATE
	app.get('/screens/new', [authMWare.isLoggedIn,widgetMWare.all, screenMWare.all], screen.new);
	app.post('/screens/create', [authMWare.isLoggedIn, widgetMWare.all, screenMWare.all], screen.create);
	app.get('/screens/:id', [authMWare.isLoggedIn,screenMWare.all, widgetMWare.all, screenMWare.fetchScreen ], screen.show);
	app.del('/screens/:id', [authMWare.isLoggedIn, widgetMWare.all], screen.delete);

	app.get('/screens/:id/widgets/add',  [authMWare.isLoggedIn,screenMWare.all, widgetMWare.all, screenMWare.fetchScreen ], screen.addWidget);
	app.post('/screens/:id/widgets/add',  [authMWare.isLoggedIn,screenMWare.all, widgetMWare.all, screenMWare.fetchScreen ], screen.updateWidgets);


//WIDGETS: CREATE, EDIT, DELETE, UPDATE
	app.get('/widgets/new', [authMWare.isLoggedIn, widgetMWare.all, screenMWare.all], widget.new);
	app.post('/widgets/create', [authMWare.isLoggedIn, widgetMWare.all, screenMWare.all], widget.create);
	app.get('/widgets/:id', [authMWare.isLoggedIn, widgetMWare.fetchWidget, widgetMWare.all, screenMWare.all ], widget.show);
} 

