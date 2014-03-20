/*
REDIS DATABASE

######### STORE UQNIQUE ID'S
ZADD  users timestamp ID

######### STORE USERS
HMSET user:ID  username "xxx"  password "xxx" email "xxx"

#########  MAINTAIN USERNAME INDEX

SADD username:xxxx   ID

#########  MAINTAIN EMAIL INDEX	

SADD email:xxx  ID


*/


var util = require("util");
var redisClient = require("../db");
var CONFIG = require("config");
var Validator = require("../lib/validation.js");
var uuid = require("node-uuid");

var user  = [
	{username: "sahilsk", id:2343, email:"sonukr666@gmail.com", password:"abc"},
	{username: "sonu", id:2343, email:"sonu.k.meena@apyl.com", password:"abcd"}
];

var TABLE_NAME = {
	plural: "users",
	singular: "user"
}

User =
{
	
	properties :{
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
	
					//VERIFY USER HAS UNIQUE USER ID
					
					redisClient.multi()
							.set("username:"+user.username, user.id) // Username index
							.set("email:"+user.email, user.id)//  Email index
							.zadd(TABLE_NAME.plural, +new Date, user.id) // unique user id's
							.hmset( TABLE_NAME.singular+":"+user.id, user)
							.exec( function(err, replies){
								util.log("MULTI got " + replies.length + " replies");
								replies.forEach(function (reply, index) {
									util.log("Reply " + index + ": " + reply.toString());
								});
								if(err){
									util.log("Failed to save user ");
								}else{
									util.log("user saved successfully");
								}

								//redisClient.end();
							});
				}
		})
	},
	
	update: function( user, callback){
			this.validate(user, function(err, pass){
				if(!pass){
					util.log("Unable to update user. Validation failed");
					util.log("Erros: %s", err);
				}else{
					//VALIDATION PASSED -> SAVE()
					redisClient.hmset( TABLE_NAME.singular+":"+user.id, user, function(err,res){
						callback(err, res);
					}); 						
				}
		})
	},

	find : function(id, callback){
		var iUser = null;
	
		var redisClient =  redis.createClient(CONFIG.port, CONFIG.host);		

		//Record exist
		redisClient.hgetall(TABLE_NAME.singular +":"+id, function(err, res){
			iUser = res;
			callback(err, iUser);
		//	redisClient.end();
		});
	},

	where_username : function(username, callback){
			var user_id = null;
			if( username !=null){
				util.log("finding user " + username );
				redisClient.get("username:"+username, function(err, res){
					if(!err){
						//util.log("query executed successfullly.." +res);
						user_id = res;
						redisClient.hgetall(TABLE_NAME.singular +":"+user_id, function(err, res){
							//util.log("finding username ...");
							callback(err, res);
							//redisClient.end();
							return;
						})
					}else{
						callback(err, null);
						return;
					}
				});
			}else{
				util.log("username was null");
				callback("username can't be null", null);
				return;
			}
	},

	where: function( searchHash, callback){
			var username = null;
			var email = null;
			var user = null;
			var user_id = null;
			if( searchHash.hasOwnProperty("username"))
				 username = searhHash.username;
			if( searchHash.hasOwnProperty("email"))
				 email = searhHash.email;
			
			var redisClient =  redis.createClient(CONFIG.port, CONFIG.host);	

			if( username !=null){
				redisClinet.get("username:"+username, function(err, res){
					if(!err){
						user_id1 = res;
					}
				});
			}
			if( email != null){
				redisClinet.get("email:"+email, function(err, res){
					if(!err){
						user_id2 = res;
					}
				});				

			}

			if( username && email)
				if(user_id1 != user_id2){
					callback(null, null);
					return null
				}
			var user_id = user_id1 || user_id2
			
			redisClient.hgetall(TABLE_NAME.singular +":"+user_id, function(err, res){
				callback(err, res);
				redisClient.end();
				
			})

	
	},

	destroy : function(id, callback){
		redisClient.del(TABLE_NAME.singular + ":"+id, function(err, res){
			callback(err,res);
		});
	}
	
}


module.exports = User;
