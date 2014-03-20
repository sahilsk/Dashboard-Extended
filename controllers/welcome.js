/*
 * GET home page.
 */
exports.index = function (req, res) {
  var user = req.session.user;
  res.render('sessions/welcome', {
        title: 'Dashboard ',
        username: user.username,
        screens: req.session.screens
  })
};