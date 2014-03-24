process.env.NODE_ENV = 'test';
var request = require('superagent');
var CONFIG = require('config');
var should = require('should');
var testUtil = require('./shared/test_util.js');
var screenFixture = require("./fixture/screen_fixture.js");

describe('Screen :', function () {
  var agent = request.agent();
  var screenRecord = {
      screen_name: 'Screen_Test01',
      screen_desc: 'Screen_Test01 desc'
    };
  before(function (done) {
    testUtil.srvCtl.start(CONFIG.app.port);
    testUtil.loginUser(agent, done);
  });
  after(function () {
    testUtil.srvCtl.stop();
    console.log('End Testing Screen...');
  });
  it('GET /screens/new', function (done) {
    agent.get(testUtil.siteRootUrl + '/screens/new').end(function (err, res) {
      if (err)
        throw err;
      res.status.should.be.exactly(200);
      res.text.should.include('Create New Screen');
      done();
    });
  });
  describe('Create New Screen Form :', function () {
    it('should deny direct post request without fields', function (done) {
      agent.post(testUtil.siteRootUrl + '/screens/create').end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(401);
        res.text.should.include('Unauthorized Access');
        done();
      });
    });
    it('should validate input params', function (done) {
      agent.post(testUtil.siteRootUrl + '/screens/create').send({
        screen_name: '',
        screen_desc: ''
      }).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.should.include('should not be empty');
        done();
      });
    });
    it('should create new screen with correct values', function (done) {
      agent.post(testUtil.siteRootUrl + '/screens/create').send({
        screen_name: 'Screen_Test01',
        screen_desc: 'Screen_Test01 desc'
      }).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.should.include('Screen(Screen_Test01) created successfully');
        done();
      });
    });
 
    describe("Screen Page: " , function(){
      var screen = null;
      before( function(done){
           screenFixture.createScreen( function(scrn){
              screen = scrn; 
              console.log("New screen created: ", screen);
              done(null);
            });
      })

      it('Should redirect if invalid screen', function (done) {
        agent.get(testUtil.siteRootUrl + '/screens/' + 'invalidscreen').end(function (err, res) {
          if (err)
            throw err;
          res.redirects.should.eql([testUtil.siteRootUrl + '/'], "Should redirect to '/' ");
          res.text.should.include('screen not found', "Invalid screen url fetched");
          done();
        });
      });

      it("Should access valid screen page", function(done){
        agent.get(testUtil.siteRootUrl + '/screens/' + screen.id).end(function (err, res) {
          if (err)
            throw err;
          res.status.should.be.exactly(200);
          done();
        });          
      })
      it('Should have delete screen button', function (done) {
        agent.get(testUtil.siteRootUrl + '/screens/'+screen.id).end(function (err, res) {
          if (err)
            throw err;
          res.status.should.be.exactly(200);
          res.text.toLowerCase().should.include("delete screen", "Button('Delete Screen') not found");
          done();
        });
      });
      it('Should show add widget button', function () {
        agent.get(testUtil.siteRootUrl + '/screens/'+screen.id).end(function (err, res) {
          if (err)
            throw err;
          res.status.should.be.exactly(200);
          res.text.toLowerCase().should.include("add new widget", "Button('add new widget') not found");
        });
      });  


      it("should render widget", function(done){
        agent.get(testUtil.siteRootUrl + '/screens/'+screen.id).end(function (err, res) {
          if (err)
            throw err;
          res.status.should.be.exactly(200);
          res.text.toLowerCase().should.include("widget_", "Widgets not found");
          done();
        });
      })

      it("should be able to delete screen", function(done){
        agent.del(testUtil.siteRootUrl + '/screens/'+screen.id).end(function (err, res) {
          if (err)
            throw err;
          res.status.should.be.exactly(200);
          res.redirects.should.eql([testUtil.siteRootUrl + '/'], "Should redirect to '/' ");
          done();
        });
      });

    });
  });





});