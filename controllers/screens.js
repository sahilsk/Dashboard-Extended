
exports.show = function(req, res){

	if( !req.session.screen){
		req.session.messages = {  
	       errors:  ["screen not found"]
	    }; 		
		res.redirect("/");
		return;
	}
	var Handlebars =  require("../hbs_helpers/hbs_helpers.js");	
	var fs = require("fs");
	var JSONParse = require('json-literal-parse')

	var source = fs.readFileSync( "presentations/table.hbs").toString();
	var context = {
		cols : req.session.screen.widgets[0].repr_setting.columns
	};
	
	
	var request = require('request')
  , es = require('event-stream')
  , async = require("async")

   var template = "";
    async.series( [
    	function(cb){
			request('http://50.18.225.222:4273/containers/json?all=1',  function (error, response, body) {
				if (!error && response.statusCode == 200) {
					try{
						remoteData = JSONParse(body);
						context.rows = remoteData;
					}catch(err){
						console.log("ERROR:::::::::::::::::::::::::: Invalid json");
						cb("Invalid JSON", null);
						return;
					}
		    		cb(null);
				}else
					cb(error, null)
			})
    	}, 
     	function(cb){
     		template = Handlebars.compile(source);
			console.log(	template(context) );
     		cb(null);
     	}],
    	function(err, results){
    		if(err)	console.log(err);
			/*
			var html = template(req.session.screen.widgets[0]);
			console.log("tempatle:::::", html);
			*/
			var data = {
				username: req.session.user.username,
				title:"Screen : ",
				widget: template(context),
				screens:require("../models/screen.js").all(),
				screen:req.session.screen	
			}	;
			
			
			res.render("screens/show", data	);
    		
    	});

	
	
	

	

}

exports.new  = function(req, res){
	var data = {
		username: req.session.user.username,
		title:"Screen : Create New",
		screens:require("../models/screen.js").all()
	}	;
	res.render("screens/new", data	);

}

exports.create = function(req, res){
	
	//Deny direct post request
	if( !req.body.hasOwnProperty("screen_name") || !req.body.hasOwnProperty("screen_desc") ){
		res.status(401);
		res.send('Unauthorized Access <a href=\'/screens/new\'>Create New Screen</a> ');
		return;
	}

	var t_screen = {name:req.body.screen_name, desc: req.body.screen_desc};
	var Screen = require("../models/screen");

	//Validate Input params
	if( !Screen.validate(t_screen) ){
		req.session.messages = {  
	       errors:  Screen.errors
	      }; 		
      	res.redirect("screens/new");
       
		return ;
	}


	//Create new screen
	if( Screen.save( t_screen ) ){
		console.log("Screen created successfully");
		req.session.messages = {	
			success: ["Screen("+t_screen.name +") created successfully" ],
			errors:[]
		 };
		res.redirect("/");
		return;

	}else{
		console.log("Failed to create screen: ", Screen.errors.join() );
		req.session.messages = {  
	       errors:  Screen.errors
	      }; 		
      	res.redirect("screens/new");	
		return;
	}
	
}

exports.delete = function(req, res){

	if( !req.session.screen){
		req.session.messages = {  
	       errors:  ["screen not found"]
	    };	
	}else{
		var Screen = require("../models/screen");
		Screen.destroy( req.session.screen);
		req.session.messages={
			success:["Screen " + req.session.screen.name + " deleted successfully"]
		}
		req.session.screen = null;
	}

	res.redirect("/");
	return;	
	
}