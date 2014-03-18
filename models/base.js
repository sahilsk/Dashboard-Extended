
var 
	  uuid = require('node-uuid')
	, CONFIG = require("config")
	, redis = require('redis')

;


/*******************
SIMPLE OBJECT TO REDIS MAPPING
********************/


/*

use case:



properties = {

	id: {
		type: "integer",
		validations :["unique", "not empty"],
		default: 1
	},
	email: {
		type: "email",
		validations: ["unique", "not empty" ],
		default: "chantu@dfd.com"
	}
}

User  = new Model('User',properties);


var user = new  User();
var user.id = "233";
var user.name = "chantu"
...
var user.save( {
	id:"sd",
	name:"dfd"
})
var user.find
var user.save()
var user.destroy()

=
*/

var CurrentModels = [];


var Base = function(){
	this.models = {};

}

Base.prototype.model = function(name, properties){

	//Create new Object
	this.childModel = new Object();

	//Register attributes
	this.registerKeys =  function(){
	
		for(key in properties){
			Object.defineProperty(this.childModel, key, {
			    get: function() {
			    	if( this.key === undefined)
			    		return null;
			        return this.key;
			    },
			    set: function(value) {
			        this.key = value;
			    }
			});
		}
	};

	this.childModel.find = function(id){
			console.log("Finding value: %s", id);

	};

	this.childModel.validate = function( obj, callback){
		var errors = [];

		for(key in properties){
			var validations = properties[key].validations;

			//should have key
			if( !obj.hasOwnProperty(key) ){

				if( validations.indexOf("required") == -1){
					errros.push ( key  +" attribute not present" );
				}
			}else{
				//should be of valid type
				if( properties[key]['type'] !== typeof(obj[key]) ){
					errors.push(  key + " invalid type.It should be "+ properties[key]['type'] );
				}
				validations.forEach( function( validation){

					switch(validation){

						case "email":
							var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    						if( re.test(obj[key]) === false){
								errors.push( key + " invalid email id" );
    						}
							break;
						case "notEmpty":
	    					if(  obj[key] !== null && obj[key].length === 0 ){
								errors.push( key + " should not be empty" );
    						}
    						break;

    					default:
    						console.log("Unhandled validation rule: %s", validation);
					}
				});
			}
		}
		callback(errors)

	}

	this.childModel.save = function(obj){
			console.log("saving values");
			if(  this.childModel.validate(obj) ){
				obj.id = uuid.v1();
				return true;
			}else{
				return false;
			}
	};


	this.registerKeys();

	this.models[name] = this.childModel;

	return this.childModel;
}


Base.prototype.factory =function(modelName){

	var  instanceObj = {};

	instanceObj.modelName = modelName;

	instanceObj.DB_MODEL = null;

	console.log( this.models);

	if( this.models.hasOwnProperty(modelName) ){
		instanceObj.DB_MODEL = this.models[modelName];

	}else{
		console.log( modelName + " not defined");
		return null;
	}

	//Create obj specific actions


	instanceObj.p = function(data){

		for(key in data){
			if( this.DB_MODEL.hasOwnProperty(key) ){
				Object.defineProperty( this, key, {
				    get: function() {
				    	if( this[key] === undefined)
				    		return null;
				        return this[key];
				    },
				    set: function(value) {
				        this[key] = value;
				    }
				});
				this[key] = data[key];

			}else{
				console.log(" Unknown property : %s", key);
			}
		}

	}

	instanceObj.save  = function(callback){

		this.DB_MODEL.validate(this, function(errors){
			var isSaved = false;
			if(errors.length> 0){
				callback(errors, isSaved );
				return isSaved;
			}
			else{
				var redisClient =  redis.createClient(CONFIG.port, CONFIG.hostname);		

				redisClient.zadd( this.modelName, +new Date, this.id, function(err, res){
					if(err){
						callback(errors, isSaved );
						return isSaved;
					}

					//Populate object hash
					
					for( key in properties ){


					}
					var tHash = 


					//redisClient.hmset(  this.modelName+":" + this.id, )
					console.log( "Saved: %s", res);

					callback(errors, isSaved );
					return isSaved;
				});

				redisClient.end();
			}

		});
	}

	instanceObj.attach = function(){

	}


	return instanceObj;



}



function getTimestamp(){

	return +new Date;
}



module.exports = new Base();