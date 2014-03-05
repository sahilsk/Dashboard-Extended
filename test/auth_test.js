process.env["NODE_ENV"] = "test";


var request = require("superagent");
var http = require("http"); 
var CONFIG = require("config");

var should = require("should");

var app = require("../app");

var siteRootUrl = "http://localhost:"+CONFIG.app.port;


describe("Authorization :", function(){ 

	before( function(){
		process.env["NODE_ENV"] = "test";
		app.set("env", "test");
		console.log("Starting app on port: %s, %s", CONFIG.app.port, process.env["NODE_ENV"] );
		this.server = http.createServer(app).listen(CONFIG.app.port, function(){
		  console.log('Express server listening on port (' + app.get('env') + ') '+  CONFIG.app.port);
		});
		this.server.on("error", function(err){
			console.log("Error:( %s ). \nExiting...", err);
			exit(0);
		});


	});
	after( function(){
		this.server.close();
		this.server.on("close", function(){
			console.log("Server stopped...");
		})
	});


	it("should see login page", function(done){
		request.get(siteRootUrl, function(e, res){
			if(e) 
				throw e;
			res.status.should.be.exactly(200);
			res.text.should.containEql("Please sign in");
			done();
		});

	});


	it("should deny invalid user login", function(done) {

		request
		.post(siteRootUrl+"/auth")
		.send({ username: 'Manny', password: 'cat' })
		.end(function(error, res){
			if(error)	
				throw error;
			res.status.should.be.exactly(200);
			res.text.should.containEql("Please sign in");

			done();
  		});
				 

	})	;
	

	it("should login with correct credentials", function(done){
		var user = { username: 'sahilsk', password: 'abc' };

		request
		.post(siteRootUrl+"/auth")
		.send(user)
		.end(function(error, res){
			if(error)
				throw error;
			res.status.should.be.exactly(200);
			res.text.should.containEql("Welcome, ",user.username );

			done();
  		});

	});

});