process.env.NODE_ENV = 'test';
var request = require('superagent');
var CONFIG = require('config');
var should = require('should');
var testUtil = require('./shared/test_util.js');
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
    it('should not create duplicate screen', function (done) {
      agent.post(testUtil.siteRootUrl + '/screens/create').send(screenRecord).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.should.include('Screen with name ' + screenRecord.screen_name + ' already exist');
        done();
      });
    });
//TODO : Remove hardocded screen id
    it('should be able to delete created screen', function(done){
      agent.del(testUtil.siteRootUrl + '/screens/abc2').end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.redirects.should.eql([testUtil.siteRootUrl + '/'], "Should redirect to '/' ");
        done();
      });

    });

    it('should be able to create after deletion of duplicate record', function (done) {
      agent.post(testUtil.siteRootUrl + '/screens/create').send(screenRecord).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200, "Should have good status code");
        res.text.should.include( screenRecord.screen_name, "Screen not created");
        done();
      });
    });

    it('should be able to open screen', function (done) {
      agent.get(testUtil.siteRootUrl + '/screens/' + screenRecord.screen_name).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        done();
      });
    });
    it('redirect to / if screen doesn\'t exist', function (done) {
      agent.get(testUtil.siteRootUrl + '/screens/' + 'invalidscreen').end(function (err, res) {
        if (err)
          throw err;
        res.redirects.should.eql([testUtil.siteRootUrl + '/'], "Should redirect to '/' ");
        res.text.should.include('screen not found', "Invalid screen url fetched");
        done();
      });
    });
  });
  describe('Screen page', function () {
    it('Should show add widget button', function () {
      agent.get(testUtil.siteRootUrl + '/screens/abc').end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.toLowerCase().should.include("add new widget", "Button('add new widget') not found");
      });
    });
//TODO : Remove hardocded screen id    
    it('Should show delete screen button', function (done) {
      agent.get(testUtil.siteRootUrl + '/screens/abc').end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.toLowerCase().should.include("delete screen", "Button('delete screen') not found");
        done();
      });
    });

  });

});