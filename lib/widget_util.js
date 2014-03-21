var
	_ = require("underscore")
  , Handlebars =  require("../hbs_helpers/hbs_helpers.js")
  , fs = require("fs")
  , JSONParse = require('json-literal-parse')
  , request = require('request')
  , es = require('event-stream')
  , async = require("async")

exports.render_widget = function( widget_obj, done ){

	if( typeof(widget_obj) !== "object")
		return null;
	if( !widget_obj.hasOwnProperty("repr_scheme") )
		return null;

	try{
		widget_obj.repr_setting = JSON.parse( widget_obj.repr_setting  )

	}catch(e){
	 	console.log("Failed to parse widget object : ", e);
		return null;
	}

	var widget_html  = "";

	switch(widget_obj.repr_scheme){
		case "Table":
			render_table(widget_obj, function( html){
				widget_html = html;
				done( widget_html);
			});
			break;
		case "Gauge":
			console.log("---- Gauge Type not implemented yet ----");
			break;
		default:
			console.log("Not Supported Representational Scheme: ", widget_obj.repr_scheme);
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
			request(fetch_url,  
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
    			console.log("Error: ", err)
    			html = null;
    		}
    		done( html );	
    });	

}

module.exports.render_table = render_table; 