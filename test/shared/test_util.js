process.env.NODE_ENV = 'test';

var http = require('http');
var CONFIG = require('config');
var app = require('../../app')

exports.siteRootUrl = CONFIG.app.host +":" + CONFIG.app.port;


exports.srvCtl = {
	server : null,
	start  : function(port){
				console.log('Starting app on port: %s, %s',port, process.env.NODE_ENV);
				this.server = http.createServer(app).listen(
						port, function () {
				  		console.log('Express server listening on port (' + app.get('env') + ') ' + port);
						}
					);
				this.server.on("error", function(err){
					console.log("ERR:: SERVER: ", err)
				});

			},
	stop: function(){
				this.server.close();
	}

}


exports.loginUser = function(agent, done) {
						var user = {
						    username: 'sahilsk',
						    password: 'admin'
						  };
						agent.post(this.siteRootUrl + '/auth').send(user).end(function (error, res) {
						  if (error)
						    throw error;
						  res.status.should.be.exactly(200);
						  res.text.should.include('Welcome, ', user.username, "Should login user with correct credentials");
						  return done();
						});
					}  


