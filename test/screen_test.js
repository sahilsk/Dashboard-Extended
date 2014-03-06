process.env.NODE_ENV = 'test';
var request = require('superagent');
var CONFIG = require('config');
var should = require('should');

var srvCtl = require("./shared/test_util.js");
var siteRootUrl = 'http://localhost:' + CONFIG.app.port;


describe("Screen :", function () {
  var agent =request.agent();
  before(  function(done){
    srvCtl.start(CONFIG.app.port);
    loginUser(agent, done);
  }); 

  after(function () {
    srvCtl.stop();
    console.log("End Testing Screen...");
  });

  it("GET /screens/new", function(done){
    agent
    .get(siteRootUrl+"/screens/new")
    .end( function(err, res){
      if(err) 
        throw err;
      res.status.should.be.exactly(200);
      res.text.should.include("Create New Screen");
      done();
    });

  });

  describe("Create New Screen Form :", function(){

      it("should deny direct post request without fields", function(done){
        agent
        .post(siteRootUrl+"/screens/create")
        .end(function(err, res){
          if(err)
            throw err;
          res.status.should.be.exactly(401);
          res.text.should.include("Unauthorized Access");
          done();
        });
      });


      it("should validate input params", function(done){
        agent
        .post(siteRootUrl+"/screens/create")
        .send({screen_name:"", screen_desc:""})
        .end(function(err, res){
          if(err)
            throw err;
          res.status.should.be.exactly(200); 
          res.text.should.include("Should not be empty");
          done();
        });
      });

      it("should create new screen with correct values", function(done){
        agent
        .post(siteRootUrl+"/screens/create")
        .send({screen_name:"Screen_Test01", screen_desc:"Screen_Test01 desc"})
        .end(function(err, res){
          if(err)
            throw err;
          res.status.should.be.exactly(200); 
          res.text.should.include("Screen(Screen_Test01) created successfully");
          done();
        });        
      });

      it("should not create duplicate screen", function(done){

        var screenRecord = {screen_name:"Screen_Test01", screen_desc:"Screen_Test01 desc"};

        agent
        .post(siteRootUrl+"/screens/create")
        .send(screenRecord)
        .end(function(err, res){
          if(err)
            throw err;
          res.status.should.be.exactly(200); 
          res.text.should.include("Screen with name " + screenRecord.screen_name + " already exist");
          done();
        });  


      });



  });



  function loginUser(agent, done){
      var user = {
        username: 'sahilsk',
        password: 'abc'
        };
      agent
      .post(siteRootUrl + '/auth')
      .send(user)
      .end(function (error, res) {
        if (error)
          throw error;
        res.status.should.be.exactly(200);
        res.text.should.containEql('Welcome, ', user.username);
        return done();
      });
  }

});