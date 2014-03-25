var async = require("async");

/*******************
Name: fetchWidget
Description: Load selected widget object
*******************/
exports.fetchWidget = function (req, res, next) {
  var Widget = require('../models/widget');

  Widget.find(req.params.id, function(err, widget){
    if( err){
       console.log("Error retrieving widget. Error: %s", err);
       req.session.widget = null;
       next();
    }else if( widget === null){
        console.log("widget not found")
        req.session.messages = {
                errors: ["widget('"+ req.params.id + "') not found..."]
              };
        req.session.widget = null;
        res.redirect('/');
    }else{
      console.log("widget found: ", widget);
      var Widget = require('../models/widget');
      req.session.widget = widget;
      next();
    }
  });; 

};

/*******************
Name: all
Description: Fetch all screens from database
*******************/
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