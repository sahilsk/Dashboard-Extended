var async = require("async");

/*******************
Name: fetchScreen
Description: Load screen object
*******************/
exports.fetchScreen = function (req, res, next) {
  var Screen = require('../models/screen');

  Screen.find(req.params.id, function(err, screen){
    if( err){
       console.log("Error retrieving screen. Error: %s", err);
       req.session.screen = null;
       next();
    }else{
      var Widget = require('../models/widget');
      var screenWidgets = [];

      async.each( screen.widgets, function( wid, done){
          console.log("Searching  widget: ", wid);
          Widget.find(wid, function(err, widget){
            if(err){
              util.log( util.format("Error retrieving widget Error '%s'", err) );
              done(err);
            }else{
              //console.log("Found widget", widget);
              screenWidgets.push(widget);
              done();
            }
          });
      }, function(err){
          if(err)
              req.session.screen = null
          else{
              req.session.screen = screen;
              req.session.screen.widgets  = screenWidgets;
            }
          next();
      });

    }
  });; 

};


exports.all = function(req, res, next){

  var Screen = require('../models/screen.js');
  var screenList = [];
  Screen.all( function(err, list){
    if(!err){
     screenList =  list; ;
    }
    req.session.screens = screenList;
    next();
  });
}