var util = require("util");
	
exports.index = function (req, res) {
  if (req.session && req.session.user)
    res.redirect('/');
  res.render('sessions/signin', { title: 'Sign in' });
};
exports.auth = function (req, res) {
  if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')) {
    res.status(401);
    console.log('Not Authorized. Please sign in first');
    req.session.messages = { errors: ['Not Authorized. Please sign in first'] };
    res.send('Unauthorized Access <a href=\'/login\'>login here </a> ');
    return;
  }
  if (req.body.username && req.body.password) {
		var User = require('../models/account.js');
		User.where_username(req.body.username, function(err, user){
			if(err){
			  util.log( util.format( 'Failed to retrieve user %s:%s ', req.body.username, err ));
			  req.session.messages = { errors: [ util.format( 'Failed to retrieve user. Error:%s', err) ] };
			  res.redirect('/login');
			  return;
			}else{
				if (!user) {
				  util.log('Invalid username ', req.body.username);
				  req.session.messages = { errors: ['Invalid username'] };
				  res.redirect('/login');
				  return;
				}
				if (user.password === req.body.password) {
				  util.log('User Authenticated');
				  req.session.messages = { success: ['Welcome, ' + user.username] };
				  req.session.user = {
					username: user.username,
					id: user.id
				  };
				  res.redirect('/');
				  return;
				} else {
				  util.log('Authentication Failed : Incorrect Password ', req.body.username);
				  req.session.messages = { errors: ['Invalid credentials'] };
				  res.redirect('/login');
				  return;
				}

		  }// end find_username 'else'
		}); // end find_username block
  }
};
exports.logout = function (req, res) {
	var user = req.session.user;
	console.log( "logging out '%s'", user.username);

	req.session.user = null;
	req.session.messages = "You are log out successfully. Don't forget to login again "+ user.username;
	res.redirect('/login');
	return; 
};