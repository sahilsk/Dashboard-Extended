
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var sass = require('node-sass'); 
var CONFIG = require("config");
var passport = require("passport");
var LocalStrategy = require('passport').Strategy;




var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
	//SASS Middleware
	app.use(
	     sass.middleware({
		 src: __dirname + '/public/stylesheets/sass', 
		 dest: __dirname + '/public',
		 debug: true,
		 outputStyle: 'compressed' 
	     })
	 );
}
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());



/*****************************
******* Authentication *******
******************************/
// passport config
var Account = require('./models/account');
passport.use('local-login', new LocalStrategy({	usernameField : 'email',
	 passwordField : 'password', 
	 passReqToCallback : true},
	 Account.authenticate ) );
passport.serializeUser(Account.serializeUser);
passport.deserializeUser(Account.deserializeUser);



/************************
*** Routes ********
************************/

require('./routes.js')(app);


module.exports = app;