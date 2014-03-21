var _ = require("underscore");
var Base = require("./base.js");
var uuid = require('node-uuid');
var redisClient = require("../db");
var CONFIG = require("config");
var async = require("async");


/*

###########  Add New Screen
zadd widgets timestamp isSaved// SCREEN LIST
hmset widget:id  key  val   key  val


###########  Retrive Widget
hgetall "widget:id" >> { k:v, k:v,[,]}


DATABASE
========================
zadd widgets 1395306635123 250ea950-b010-11e3-a66e-551bed25837a


HMSET widget:250ea950-b010-11e3-a66e-551bed25837a id  "250ea950-b010-11e3-a66e-551bed25837a"  	url  "http://50.18.225.222:4273/containers/json?all=1" data_template ""  	pre_data  "" post_data ""  validation_schema  ""  	repr_scheme  "Table"  	repr_setting '{"columns":[{"name":"Id","type":"string"},{"name":"Image","type":"string"},{"name":"Command","type":"string"},{"name":"Created","type":"number"},{"name":"Status","type":"string"},{"name":"Ports","type":"string"},{"name":"SizeRw","type":"number"},{"name":"SizeRootFs","type":"number"},{"name":"Names","type":"string"}],"showRowNumber":true}'  	events   "{}"  	setting  "{}"


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

	find: function(id, callback){

		console.log( TABLE_NAME.singular + ":" + id );
		redisClient.hgetall( TABLE_NAME.singular + ":" + id, function(err, res){ callback(err, res) } );
	}

}

module.exports = Widget;