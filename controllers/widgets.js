exports.show = function (req, res) {
  res.send('W.I.P');
};
exports.new = function (req, res) {
  var data = {
      username: req.session.user.username,
      title: 'Widget : New',
      screens: req.session.screens    };
  res.render('widgets/new', data);
};
exports.create = function (req, res) {

  res.send('W.I.P');
};
exports.load_widget = function (id, params) {
};