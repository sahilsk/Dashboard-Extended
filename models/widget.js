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
zadd widgets timestamp isSaved// SCREEN LIST
hmset widget:id  key  val   key  val


###########  Retrive Widget
hgetall "widget:id" >> { k:v, k:v,[,]}


DATABASE
========================

ADD
=====
zadd widgets 1395306635123 250ea950-b010-11e3-a66e-551bed25837a
HMSET widget:250ea950-b010-11e3-a66e-551bed25837a id  "250ea950-b010-11e3-a66e-551bed25837a"  	url  "http://50.18.225.222:4273/containers/json?all=1" data_template ""  	pre_data  "" post_data ""  validation_schema  ""  	repr_scheme  "Table"  	repr_setting '{"columns":[{"name":"Id","type":"string"},{"name":"Image","type":"string"},{"name":"Command","type":"string"},{"name":"Created","type":"number"},{"name":"Status","type":"string"},{"name":"Ports","type":"string"},{"name":"SizeRw","type":"number"},{"name":"SizeRootFs","type":"number"},{"name":"Names","type":"string"}],"showRowNumber":true}'  	events   "{}"  	setting  "{}"


DELETE
======
Confirm widget is not used elsewhere?
	screen_widgets:* should not container widget_id
	zrem widgets widget_id
	del widget:id

RETRIEVE
========
zadd 


*/


var TABLE_NAME = {
	singular: "widget",
	plural: "widgets"
}

/*
var widgets = [
	{
		id: "2348hdjfhui434",
	 	url:"http://50.18.225.222:4273/containers/json?all=1",
	 	data_template: "",
	 	pre_data:"",
	 	post_data:"",
	 	validation_schema:"",
	 	repr_scheme:"Table",
	 	repr_setting:{
	 		columns: [
	 			 { name: 'id'		, type: 'string'},
	 			 {  name: 'Image'	, type:'string'	},		
	 			 {  name: 'Command'	, type:'string'	},	
	 			 {  name: 'Created'	, type:'number'	},
	 			 {  name:'Status'	, type:'string'	},	
	 			 {  name:'Ports'		, type:'string'	},	
	 			 {  name:'SizeRw'	, type:'number'	},
	 			 {  name:'SizeRootFs', type:'number'	},	
	 			 {  name:'Names'		, type:'string'	}	
	 		],
	 		showRowNumber: true
	 	},
	 	events:{},
	 	refreshInterval: 2300
	} ,
	{
		id: "2348hdjfhui45",
	 	url:"http://50.18.225.222:4273/containers/json?all=1",
	 	data_template: "",
	 	pre_data:"",
	 	post_data:"",
	 	validation_schema:"",
	 	repr_scheme:"Table",
	 	repr_setting:{
	 		columns: [
	 			 { name: 'Id'		, type: 'string'},
	 			 {  name: 'Image'	, type:'string'	},		
	 			 {  name: 'Command'	, type:'string'	},	
	 			 {  name: 'Created'	, type:'number'	},
	 			 {  name:'Status'	, type:'string'	},	
	 			 {  name:'Ports'		, type:'string'	},	
	 			 {  name:'SizeRw'	, type:'number'	},
	 			 {  name:'SizeRootFs', type:'number'	},	
	 			 {  name:'Names'		, type:'string'	}	
	 		],
	 		showRowNumber: true
	 	},
	 	events:{},
	 	setting:{}
	} 	
	];
*/
var Widget = {
	/*
	errors: [],
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
	*/

	properties :{
		name: {
			type: "string",
			validations: ["notEmpty"]
		},		
		url: {
			type: "string",
			validations: ["notEmpty"]
		},
		repr_scheme: {
			type: "string",
			validations: ["notEmpty"]
		},
		repr_setting:{
			type:"object",
			validations: ["notEmpty"]
		},
		refreshInterval:{
			type:"number",
			validations:["notEmpty"]
		}
	},
	all: function(callback){
		var widgetList = [];
		redisClient.zrange(TABLE_NAME.plural, 0, -1, function(err, list){
			if(err){
				callback(err, widgetList)
				return;
			}else{
				async.each(list, function(wid, done){
					redisClient.hgetall( TABLE_NAME.singular+":"+wid, function(err, widget){
							widgetList.push(widget);
							done(err);
					});

				}, function(err){	    
					callback(err, widgetList);
				});
			}l
		});
			
	},	
	validate : function(record, callback){
				var validator = new Validator(this.properties);
				validator.validate(record, function(err, pass){
					callback( err, pass);
				});
	},
	save :function(widget, callback){
			//ONLY NEW RECORD
			if( !widget.hasOwnProperty("id") ){
				widget.id =  uuid.v1();
			}else{
				util.log("Not a new record. Saving failed");
				calback("Not a new record", null);
				return;
			}	

		
			this.validate(widget, function(err, pass){
				if(!pass){
					util.log("Unable to save. Validation failed");
					console.log("Validation Errors: ", err);
					callback(err, null);
					return;
				}else{
					//VALIDATION PASSED
					var timestamp = +new Date;
					var redisTransaction = redisClient.multi();
						redisTransaction
							.zadd(TABLE_NAME.plural, timestamp, widget.id) // SCREENS-ID SET 
							.hmset( TABLE_NAME.singular+":"+widget.id, widget)
							.exec( function(err, replies){
								util.log("MULTI got " + replies.length + " replies");
								replies.forEach(function (reply, index) {
									util.log("Reply " + index + ": " + reply.toString());
								});
								if(err){
									util.log("Failed to save record  "+err);
									callback("Failed to save record" + err);
								}else{
									util.log("widget saved successfully");
									callback(null, widget);
								}
								//redisClient.end();
						});


				}
			})
	},	

	find: function(id, callback){

		console.log( TABLE_NAME.singular + ":" + id );
		redisClient.hgetall( TABLE_NAME.singular + ":" + id, function(err, res){ callback(err, res) } );
	},
	destroy: function(obj, callback){
		redisClient.multi()
			.del( TABLE_NAME.singular +":"+obj.id)
			.zrem( TABLE_NAME.plural , obj.id)
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

module.exports = Widget;