process.env.NODE_ENV = 'test';

var http = require('http');
var CONFIG = require('config');
var app = require('../../app')


var srvCtl = {
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


module.exports = srvCtl;