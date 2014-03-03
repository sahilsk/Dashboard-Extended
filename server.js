var http = require('http');
var CONFIG = require("config");


var app = require("./app.js");


http.createServer(app).listen(CONFIG.app.port, function(){
  console.log('Express server listening on port (' + app.get('env') + ') '+  CONFIG.app.port);
});