
/*
 * GET home page.
 */

exports.index = function(req, res){

	var user = req.session.user;

	 res.render('welcome', { title: 'Dashboard ', username:user.username });
};

