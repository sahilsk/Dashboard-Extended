process.env.NODE_ENV = 'test';

var request = require('superagent');
var should = require('should');
var CONFIG = require('config');


var testUtil = require("./shared/test_util.js");


describe('Authorization :', function () {
  before(function () {
    console.log("Testing Authorization...");
    testUtil.srvCtl.start(CONFIG.app.port);
  });
  after(function () {
    testUtil.srvCtl.stop();
    console.log("End Testing Authorization...");
  });
  it('GET /login', function (done) {
    request.get(testUtil.siteRootUrl, function (e, res) {
      if (e)
        throw e;
      res.status.should.be.exactly(200);
      res.text.should.containEql('Please sign in');
      done();
    });
  });
  it('POST /auth', function (done) {
    request.post(testUtil.siteRootUrl + '/auth').end(function (err, res) {
      if (err)
        throw err;
      res.status.should.be.exactly(401);
      done();
    });
  });
  it('Deny access to un-registered user', function (done) {
    request.post(testUtil.siteRootUrl + '/auth').send({
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
    agent.post(testUtil.siteRootUrl + '/auth').send(user).end(function (error, res) {
      if (error)
        throw error;
      res.status.should.be.exactly(200);
      res.redirects.should.eql([testUtil.siteRootUrl +"/"] );
      res.text.should.include('Welcome, ', user.username);
      done();
    });
  });
});

describe("/logout ", function(){
  var agent = request.agent();
  before(  function(done){
    testUtil.srvCtl.start(CONFIG.app.port);
    testUtil.loginUser(agent, done);
  }); 

  after( function(){
     testUtil.srvCtl.stop();
  });

  it("should destroy user session", function(){
      true.should.be.ok;
   // done();
  })



});