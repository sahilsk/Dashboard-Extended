var _ = require("underscore");
var uuid = require('node-uuid');

var screens = [
	{ id: "abc", name:"screen01", 	desc:"screen01 desc"} ,
	{ id: "abc2", name:"screen02", 	desc:"screen02 desc"} 
	];

var Screen = {

	screens : screens,
	all: function(){
			return screens
	},
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

	find: function(id){
		console.log( "searching for ", id);
		return _.where(this.all(), {id:id});
	}

}

module.exports = Screen;