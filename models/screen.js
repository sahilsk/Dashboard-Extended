var _ = require("underscore");

var screens = [
	{ name:"screen01", 	desc:"screen01 desc"} ,
	{ name:"screen02", 	desc:"screen02 desc"} 
	];

var Screen = {

	all: screens,
	errors: [],
	save :function(obj){
		this.errors = [];
		if( _.where(this.all, {name:obj.name}).length == 0){
			this.all.push(obj);
			
			return true;
		}else{
			this.errors.push("Screen with name " + obj.name + " already exist");
			return false;
		}

	}

}

module.exports = Screen;