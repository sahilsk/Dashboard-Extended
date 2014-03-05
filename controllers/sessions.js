exports.index = function (req, res) {
  if (req.session && req.session.user)
    res.redirect('/');
  res.render('signin', { title: 'Sign in' });
};
exports.auth = function (req, res) {
  if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')) {
    res.status(401);
    console.log('Not Authorized. Please sign in first');
    req.session.messages = 'Not Authorized. Please sign in first';
    res.send('Unauthorized Access <a href=\'/login\'>login here </a> ');
    return;
  }
  if (req.body.username && req.body.password) {
    var User = require('../models/account').User;
    var u = User.where({ username: req.body.username })[0];
    if (!u) {
      console.log('Invalid credentials ', req.body.username);
      req.session.messages = 'Invalid credentials';
      res.redirect('/login');
      return;
    }
    if (u.password === req.body.password) {
      console.log('valid user found');
      req.session.messages = 'Welcome, ' + u.username;
      req.session.user = {
        username: u.username,
        id: u.id
      };
      res.redirect('/');
      return;
    } else {
      console.log('Invalid user ', req.body.username);
      req.session.messages = 'Invalid credentials';
      res.redirect('/login');
      return;
    }
  }
};
exports.logout = function (req, res) {
  var User = require('../models/account').User;
  var u = User.find(req.session.user);
  req.session.user = null;
  req.session.messages = 'You are log out successfully';
  res.redirect('/login');
  return;
};