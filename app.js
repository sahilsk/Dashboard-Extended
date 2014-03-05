
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var sass = require('node-sass'); 
var CONFIG = require("config");


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
		 debug: false,
		 outputStyle: 'compressed' 
	     })
	 );
}
app.use(express.static(path.join(__dirname, 'public')));

/*****************************
******* Authentication *******
*****************************/

 







/****************************
*********** Routes **********
****************************/

require('./routes.js')(app);

module.exports = app;