var _ = require("underscore");
var Base = require("./base.js");
var uuid = require('node-uuid');
var redisClient = require("../db");
var CONFIG = require("config");
var async = require("async");
var util = require("util");	
var Validator = require("../lib/validation.js");

/*

###########  Add New Screen
zadd screens timestamp isSaved// SCREEN LIST
hmset screen:id title xxx description xxx 
----------- After adding widget
zadd screen_widgets:screen_id   timestamp  widget_id


###########  Retrive Screen
zscore screens id == nil  >> Return record not found
hgetall "screen:id" >> { k:v, k:v,[,]}

###########  Delete Screen
del screen:id
zrem screens id
del screen_widgets:screen_id


DATABASE
========================
zadd screens 1395306635123 e50e1468-b057-41b0-8cb7-7a99c6ad26b6
zadd screens 1395306691862 5ba6ba85-a808-4d8a-bec1-324f5874c026


HMSET screen:e50e1468-b057-41b0-8cb7-7a99c6ad26b6 id e50e1468-b057-41b0-8cb7-7a99c6ad26b6   name "screen 01"  description "screen 01 description"
HMSET screen:5ba6ba85-a808-4d8a-bec1-324f5874c026 id 5ba6ba85-a808-4d8a-bec1-324f5874c026  name "screen 02"  description "screen 02 description"


zadd screen_widgets:e50e1468-b057-41b0-8cb7-7a99c6ad26b6  1395307181550  250ea950-b010-11e3-a66e-551bed25837a


*/


var screens = [
		{ id: "e50e1468-b057-41b0-8cb7-7a99c6ad26b6", name:"screen01", 	description:"screen01 desc", widgets: ["2348hdjfhui434", "2348hdjfhui45"] } ,
		{ id: "5ba6ba85-a808-4d8a-bec1-324f5874c026", name:"screen02", 	description:"screen02 desc",  widgets: ["2348hdjfhui434"	]} 
	];

var TABLE_NAME = {
	singular: "screen",
	plural: "screens",
	hasMany : "widgets"

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

	properties :{
		name: {
			type: "string",
			validations: ["notEmpty"]
		},
		description: {
			type: "string",
			validations:[]
		}
	},
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
	validate : function(record, callback){
				var validator = new Validator(this.properties);
				validator.validate(record, function(err, pass){
					callback( err, pass);
				});
	},
	save :function(screen, callback){
			//ONLY NEW RECORD
			if( !screen.hasOwnProperty("id") ){
				screen.id =  uuid.v1();
			}else{
				util.log("Not a new record. Saving failed");
				calback("Not a new record", null);
				return;
			}	

		
			this.validate(screen, function(err, pass){
				if(!pass){
					util.log("Unable to save. Validation failed");
					console.log("Validation Errors: ", err);
					callback(err, null);
					return;
				}else{
					//VALIDATION PASSED

					var timestamp = +new Date;
					var screenWidgets = screen.widgets;
					delete( screen.widgets);

					var redisTransaction = redisClient.multi();
						redisTransaction
							.zadd(TABLE_NAME.plural, timestamp, screen.id) // SCREENS-ID SET 
							.hmset( TABLE_NAME.singular+":"+screen.id, screen);

					async.each( screenWidgets, function(widget, done){
						redisTransaction
							.zadd("screen_widgets:"+screen.id, timestamp, widget.id);
						done(null); 
					}, function(err){
						redisTransaction
								.exec( function(err, replies){
									util.log("MULTI got " + replies.length + " replies");
									replies.forEach(function (reply, index) {
										util.log("Reply " + index + ": " + reply.toString());
									});
									if(err){
										util.log("Failed to save record  "+err);
										callback("Failed to save record" + err);
									}else{
										util.log("screen saved successfully");
										callback(null, screen);
									}
									//redisClient.end();
						});

					});					

				}
			})
	},
	

	find: function(id, callback){
		//Record exist
		redisClient.hgetall(TABLE_NAME.singular +":"+id, function(err, screen){
			//ATTACHING WIDGETS

			if( err){
				callback(err, null);
				return;
			}

			if( screen === null){
				callback(null, null);
				return;
			}else {
				redisClient.zrange(  TABLE_NAME.singular + "_widgets:" + id, 0, -1 , function(err, widgets){
					if(err)
						callback(err, screen);
					else{
						screen.widgets = widgets;
						callback(null, screen);
					}
					return;
				})
			}
			
		//	redisClient.end();
		});
	},

	fetchWidgets : function(screen_id, callback){

			redisClient.zrange(  TABLE_NAME.singular + "_widgets:" + screen_id, 0, -1 , function(err, idlist){
				if(err)
					callback(err, null);
				else{
					callback(null, idlist);
				}
				return;
			})

	},


	destroy: function(obj, callback){
		redisClient.multi()
			.del( TABLE_NAME.singular +":"+obj.id)
			.zrem( TABLE_NAME.plural , obj.id)
			.del( "screen_widgets:"+ obj.id)
			.exec( function(err, replies){
				util.log("MULTI got " + replies.length + " replies");
				replies.forEach(function (reply, index) {
					util.log("Reply " + index + ": " + reply.toString());
				});
				callback(null);
				//redisClient.end();
			});

	}

}

module.exports = Screen;