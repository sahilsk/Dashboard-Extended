process.env.NODE_ENV = 'test'


var http = require("http");
var CONFIG = require("config");

var app = require('../../app.js');


describe('login page',function(){

	before( function(){
		this.server = http.createServer(app).listen( CONFIG.app.port, function(){
		  console.log('Test Express server listening on port  (' + CONFIG.app.port+ ') '
		   + process.env.NODE_ENV);
		});
	});


	it("should show login page if user not logged in");
	it("should validate inputs(email)");
	it("should show index page if user logged in");

	after( function(done){
		this.server.close(done);
	})


});