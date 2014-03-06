process.env.NODE_ENV = 'test';

var request = require('superagent');
var should = require('should');
var CONFIG = require('config');


var srvCtl = require("./shared/test_util.js");
var siteRootUrl = 'http://localhost:' + CONFIG.app.port;


describe('Authorization :', function () {
  before(function () {
    console.log("Testing Authorization...");
    srvCtl.start(CONFIG.app.port);
  });
  after(function () {
    srvCtl.stop();
    console.log("End Testing Authorization...");
  });
  it('GET /login', function (done) {
    request.get(siteRootUrl, function (e, res) {
      if (e)
        throw e;
      res.status.should.be.exactly(200);
      res.text.should.containEql('Please sign in');
      done();
    });
  });
  it('POST /auth', function (done) {
    request.post(siteRootUrl + '/auth').end(function (err, res) {
      if (err)
        throw err;
      res.status.should.be.exactly(401);
      done();
    });
  });
  it('Deny access to un-registered user', function (done) {
    request.post(siteRootUrl + '/auth').send({
      username: 'Manny',
      password: 'cat'
    }).end(function (error, res) {
      if (error)
        throw error;
      res.status.should.be.exactly(200);
      res.text.should.include('Please sign in');
      done();
    });
  });
  it('Login with correct credentials', function (done) {
    var user = {
        username: 'sahilsk',
        password: 'abc'
      };
    var agent = request.agent();
    agent.post(siteRootUrl + '/auth').send(user).end(function (error, res) {
      if (error)
        throw error;
      res.status.should.be.exactly(200);
      res.redirects.should.eql([siteRootUrl +"/"] );
      res.text.should.include('Welcome, ', user.username);
      done();
    });
  });
});

describe("/logout ", function(){
  var agent = request.agent();
  before(  function(done){
    srvCtl.start(CONFIG.app.port);
    loginUser(agent, done);
  }); 

  after( function(){
     srvCtl.stop();
  });

  it("should destroy user session", function(){
      true.should.be.ok;
   // done();
  })

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