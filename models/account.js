var util = require("util");
var redis = require("redis");
var CONFIG = require("config");
var Validator = require("/lib/validation.js");
var uuid = require("node-uuid");

var user  = [
	{username: "sahilsk", id:2343, email:"sonukr666@gmail.com", password:"abc"},
	{username: "sonu", id:2343, email:"sonu.k.meena@apyl.com", password:"abcd"}
];

var TABLE_NAME = {
	plural: "screens",
	singular: "screen"
}

exports.User = function(){ return user;}

exports.User =
{
	
	properties = {
		username: {
			type: "string",
			validations: ["notEmpty"]
		},
		email: {
			type: "email",
			validations:["notEmpty"]
		},
		password: {
			type: "string",
			validations: ["notEmpty"]
		},
		method: function(){
			is_unique_username : function(key, callback){
				//TODO				
			}
		}

	},
	
	validate : function(user, callback){
			var validator = new Validator(properties);
			validator.validate(user, function(err, pass){
				callback( err, pass);
			});
	},

	save : function(user , callback){
		
		this.validate(user, function(err, pass){
				if(!pass){
					util.log("Unable to save. Validation failed");
					util.log("Erros: %s", err);
				}else{
					//VALIDATION PASSED -> SAVE()
					if( !user.hasOwnProperty("id") )
						user.id =  uuid.v1(); 
					//ADD ZADD users timestamp id
					var redisClient =  redis.createClient(CONFIG.port, CONFIG.hostname);		
					redisClient.zadd( "users", +new Date, user.id, function(err, res){
						if(!err){
							redisClient.hmset( TABLE_NAME.singular+":"+user.id, user, function(err,success){
								if(!err){
									util.log("user saved successfully");
								}else{
									util.log("Failed to save user");
								}
							}); 						
						}					
					});
				}
		})
	},
	
	update: function( user, callback){
			this.validate(user, function(err, pass){
				if(!pass){
					util.log("Unable to save. Validation failed");
					util.log("Erros: %s", err);
				}else{
					//VALIDATION PASSED -> SAVE()
					var redisClient =  redis.createClient(CONFIG.port, CONFIG.hostname);		
					redisClient.hmset( TABLE_NAME.singular+":"+user.id, user, function(err,success){
						if(!err){
							util.log("user saved successfully");
						}else{
							util.log("Failed to save user");
						}
					}); 						
				}
		})
	},

	find : function(id, callback){
		var iUser = null;
	
		var redisClient =  redis.createClient(CONFIG.port, CONFIG.hostname);		

		//Record exist
		redisClient.hgetall(TABLE_NAME.singular +":"+id, function(err, res){
			iUser = res;
			callback(err, iUser);
			redisClient.end();
		});
	},

	destroy : function(id, callback){
		redisClient.del(TABLE_NAME.singular + ":"+id, function(err, res){
			callback(err,res);
		});	
	}
	
}