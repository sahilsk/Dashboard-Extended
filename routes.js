var routes = require('./routes/');
var user = require('./routes/user');
var login = require('./routes/login');
var passport = require('passport');


module.exports = function(app){

	app.get('/', passport.authenticate('local-login', {
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}) , routes.index);
	app.get('/users', user.list );
	app.get('/login', login.index);
}

