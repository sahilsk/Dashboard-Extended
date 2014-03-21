var _ = require("underscore");
var Base = require("./base.js");
var uuid = require('node-uuid');
var redisClient = require("../db");
var CONFIG = require("config");
var async = require("async");

/*

###########  Add New Screen
zadd screens timestamp isSaved// SCREEN LIST
hmset screen:id title xxx description xxx 
----------- After adding widget
zadd screen-widgets:screen_id   timestamp  widget_id


###########  Retrive Screen
zscore screens id == nil  >> Return record not found
hgetall "screen:id" >> { k:v, k:v,[,]}


DATABASE
========================
zadd screens 1395306635123 e50e1468-b057-41b0-8cb7-7a99c6ad26b6
zadd screens 1395306691862 5ba6ba85-a808-4d8a-bec1-324f5874c026


HMSET screen:e50e1468-b057-41b0-8cb7-7a99c6ad26b6 id e50e1468-b057-41b0-8cb7-7a99c6ad26b6   name "screen 01"  description "screen 01 description"
HMSET screen:5ba6ba85-a808-4d8a-bec1-324f5874c026 id 5ba6ba85-a808-4d8a-bec1-324f5874c026  name "screen 02"  description "screen 02 description"


zadd screen-widgets:e50e1468-b057-41b0-8cb7-7a99c6ad26b6  1395307181550  250ea950-b010-11e3-a66e-551bed25837a


*/


var screens = [
		{ id: "e50e1468-b057-41b0-8cb7-7a99c6ad26b6", name:"screen01", 	desc:"screen01 desc", widgets: ["2348hdjfhui434", "2348hdjfhui45"] } ,
		{ id: "5ba6ba85-a808-4d8a-bec1-324f5874c026", name:"screen02", 	desc:"screen02 desc",  widgets: ["2348hdjfhui434"	]} 
	];

var TABLE_NAME = {
	singular: "screen",
	plural: "screens"

}

/*


var Screen = Base.model("Screen", {
	id: {
		type: "String",
		validations:["notEmpty"],
		unique: true
	},
	name: {
		type: "String",
		validations:["notEmpty"],
		unique: true
	},	
	description: {
		type: "String",
		validations:[]
	},	
	widgets:{
		type: "Array",
		validations:[]
	}

});


var screen = Base.factory("Screen");


screen.p(
	{
	 id: "abc", 
	name:"screen01",
	description:"screen01 desc",
	widgets: ["2348hdjfhui434", "2348hdjfhui45"	] 
	}
);

 console.log(screen);


screen.save( function(errors, isSaved ){

		if(isSaved == true)
			console.log("Saved successfully");

		else{

			console.log("Error while saving");
			console.log( errors);
			return;
		}
});

*/

var Screen = {

	screens : screens,
	all: function(callback){
		var screenList = [];
		redisClient.zrange(TABLE_NAME.plural, 0, -1, function(err, list){
			if(err){
				callback(err, screenList)
				return;
			}else{
				async.each(list, function(screen_id, done){
					redisClient.hgetall( TABLE_NAME.singular+":"+screen_id, function(err, screen){
							screenList.push(screen);
							done(err);
					});

				}, function(err){			    
					callback(err, screenList);
				});
			}
		});
			
	},	

	errors: {},
	validate: function(obj){
		this.errors = [];
		
		//REQUIRED
		if( !obj.hasOwnProperty("name")  ||
			!obj.hasOwnProperty("desc") ){
			console.log('Require attributes absent');
			this.errors.push('Require attributes absent');
		}

		//Name.length > 0
		if( obj.name.length == 0){
			this.errors.push( "Screen name should not be empty");
		}

		//Name should be unique
		if( _.where(this.all(), {name:obj.name}).length > 0){
			this.errors.push("Screen with name " + obj.name + " already exist");
		}
		if( this.errors.length ==0)
			return true;
		else
			return false;

	},

	save :function(obj){
		this.errors = [];
		if(  this.validate(obj) ){
			obj.id = uuid.v1();
			this.screens.push(obj);			
			return true;
		}else{
			return false;
		}

	},

	find: function(id, callback){
		//Record exist
		redisClient.hgetall(TABLE_NAME.singular +":"+id, function(err, screen){
			//ATTACHING WIDGETS

			if( err){
				callback(err, null);
				return;
			}

			redisClient.zrange( "screen-widgets:"+id, 0, -1 , function(err, widgets){
				if(err)
					callback(err, null);
				else{
					screen.widgets = widgets;
					callback(null, screen);
				}
				return;
			}  )
			
		//	redisClient.end();
		});
	},

	destroy: function(obj){
		console.log("Deleting ", obj.name);

		var filtered = _.filter(this.screens, function(dbRec){
			return obj.id !== dbRec.id
		});
		this.screens = filtered;


	}

}

module.exports = Screen;