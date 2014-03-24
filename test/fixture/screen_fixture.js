var Screen = require("../../models/screen");

var screenRecord = {
      screen_name: 'Screen_Test01',
      screen_desc: 'Screen_Test01 desc'
    };


var storedScreens = [];
/*
Create test data
*/

exports.createScreen = function(cb){
	var t_screen = {
	  name: screenRecord.screen_name,
	  description: screenRecord.screen_desc,
	  widgets : []
	};

	Screen.save( t_screen, function(err, screen){
		if(!err){
			console.log('Screen(' + t_screen.name + ') created successfully');
			storedScreens.push(screen);
			cb(screen);
		}else{
			console.log('Failed to create screen: ',err);
			cb(null);
		}
	});
}



/*
Remove test data
*/

exports.destroyScreen = function(screen, cb){
  if (!req.session.screen) {
    req.session.messages = { errors: ['screen not found'] };
  } else {
    var Screen = require('../models/screen');
    Screen.destroy(screen, function(err){
  		if(err){
  			util.log("Failed to delete screen "+err);
  		}else{
  			util.log("'Screen ' + screen.name + ' deleted successfully'");
  		}
	  });
  }	
}



