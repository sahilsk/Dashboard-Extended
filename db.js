var redis = require("redis");

var CONFIG  = require("config");


console.log("Connecting to redis...%s:%s", CONFIG.redis.host, CONFIG.redis.port);
var client =  redis.createClient(CONFIG.redis.port, CONFIG.redis.host);


client.on("error", function (err) {
        console.log("Error " + err);
 });

client.on("connection", function(err){
	console.log("Connected succesfully");
});


module.exports = client;
