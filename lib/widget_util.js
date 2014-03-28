var
	_ = require("underscore")
  , Handlebars =  require("../hbs_helpers/hbs_helpers.js")
  , fs = require("fs")
  , JSONParse = require('json-literal-parse')
  , request = require('request')
  , es = require('event-stream')
  , async = require("async")

exports.render_widget = function( widget_obj, callback ){

	if(  widget_obj === null || typeof(widget_obj) !== "object" ){
		callback("Not an object", null);
		return;
	}
	if( !widget_obj.hasOwnProperty("repr_scheme") ){
		callback("Doesn't have representation scheme", null);
		return;
	}

	try{
		var a = JSON.parse( widget_obj.repr_setting  )
		widget_obj.repr_setting = a;

	}catch(e){
	 	console.log("Failed to parse widget object : "+ e);
	 	callback(e, null);
		return;
	}

	var widget_html  = "";

	switch(widget_obj.repr_scheme){
		case "Table":
			render_table(widget_obj, function( err, html){
				widget_html = html;
				callback(err, widget_html);
			});
			break;
		case "Gauge":
			console.log("---- Gauge Type not implemented yet ----");
			callback("---- Gauge Type not implemented yet ---", null);
			break;
		default:
			console.log("Not Supported Representational Scheme: ", widget_obj.repr_scheme);
			callback("Not Supported Representational Scheme: "+ widget_obj.repr_scheme, null);

	}


}



function render_table ( table_widget, done ){
	var html = null;

	var defaults = {
		showRowNumber:false
	}

	var fetch_url = table_widget.url;
	var opts =  _.extend(defaults, table_widget.repr_setting) 

	//PRE-POST DATA
	var pre_data = table_widget.pre_data;
	var post_data = table_widget.post_data;

	var tbl_cols = opts.columns;

	var tmp_src = fs.readFileSync( "presentations/table.hbs").toString();
	var tmpl_context = {
		id:table_widget.id,
		cols : tbl_cols,
		rows:[]
	};

	
   var template = "";
    async.series( [
    	function(cb){
			request( {  url:fetch_url, timeout:5000},  
				function (error, response, body) {
				if (!error && response.statusCode == 200) {
					try{
						remoteData = JSONParse(body);
						tmpl_context.rows = remoteData;
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
     		template = Handlebars.compile(tmp_src);
     		html = template(tmpl_context);
			//console.log( html );
     		cb(null);
     	}],
    	function(err, results){
    		if(err)	{
    			console.log("Error rendering widget: ", err)
    			html = null;
    		}
    		done( err, html );	
    });	

}

module.exports.render_table = render_table; 