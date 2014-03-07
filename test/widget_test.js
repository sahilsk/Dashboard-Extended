process.env.NODE_ENV = 'test';
var request = require('superagent');
var CONFIG = require('config');
var should = require('should');
var testUtil = require('./shared/test_util.js');
describe('Widget :', function () {
  var agent = request.agent();
  var WidgetRecord = {
      Widget_name: 'Widget_Test01',
      Widget_desc: 'Widget_Test01 desc'
    };
  before(function (done) {
    testUtil.srvCtl.start(CONFIG.app.port);
    testUtil.loginUser(agent, done);
  });
  after(function () {
    testUtil.srvCtl.stop();
    console.log('End Testing Widget...');
  });
  it('GET /widgets/new', function (done) {
    agent.get(testUtil.siteRootUrl + '/widgets/new').end(function (err, res) {
      if (err)
        throw err;
      res.status.should.be.exactly(200);
      res.text.should.include('Create New Widget', "Create new widget page not found");
      done();
    });
  });
  describe('Create New Widget Form :', function () {
    it('should deny direct post request without fields', function (done) {
      agent.post(testUtil.siteRootUrl + '/widgets/create').end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(401);
        res.text.should.include('Unauthorized Access');
        done();
      });
    });
    it('should validate input params', function (done) {
      agent.post(testUtil.siteRootUrl + '/widgets/create').send({
        Widget_name: '',
        Widget_desc: ''
      }).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.should.include('should not be empty');
        done();
      });
    });
    it('should create new Widget with correct values', function (done) {
      agent.post(testUtil.siteRootUrl + '/widgets/create').send({
        Widget_name: 'Widget_Test01',
        Widget_desc: 'Widget_Test01 desc'
      }).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.should.include('Widget(Widget_Test01) created successfully');
        done();
      });
    });
    it('should not create duplicate Widget', function (done) {
      agent.post(testUtil.siteRootUrl + '/widgets/create').send(WidgetRecord).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.should.include('Widget with name ' + WidgetRecord.Widget_name + ' already exist');
        done();
      });
    });
    it('should be able to open Widget', function (done) {
      agent.get(testUtil.siteRootUrl + '/widgets/' + WidgetRecord.Widget_name).end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        done();
      });
    });
    it('redirect to / if Widget doesn\'t exist', function (done) {
      agent.get(testUtil.siteRootUrl + '/widgets/' + 'invalidWidget').end(function (err, res) {
        if (err)
          throw err;
        res.redirects.should.eql([testUtil.siteRootUrl + '/'], "Should redirect to '/' ");
        res.text.should.include('Widget not found', "Invalid Widget url fetched");
        done();
      });
    });
  });
  describe('Widget page', function () {
    it('Should show add widget button', function () {
      agent.get(testUtil.siteRootUrl + '/widgets/abc').end(function (err, res) {
        if (err)
          throw err;
        res.status.should.be.exactly(200);
        res.text.toLowerCase().should.include("add new widget", "Add button('add new widget') not found");
      });
    });
  });

});