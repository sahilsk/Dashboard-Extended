process.env.NODE_ENV = 'test'


var http = require("http");
var CONFIG = require('config');


var server = require("../shared/test_util.js");
var siteRootUrl = 'http://localhost:' + CONFIG.app.port;

