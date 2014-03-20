/*******************
Name: fetchScreen
Description: Load screen object
*******************/
exports.fetchScreen = function (req, res, next) {
  var Screen = require('../models/screen');
  var tScreen = Screen.find(req.params.id, function(err, screen){
    if( err){
        req.session.screen = null;
        next();
    }else{

      
      screen-widgets


    }



  });;






    //get all widgets
    var Widget = require('../models/widget');
    var widgets = [];
    var screen = tScreen[0];
    console.log(screen);
    screen.widgets.forEach(function (wid) {
      if (typeof wid != 'object')
        widgets.push(Widget.find(wid)[0]);
      else
        widgets.push(wid);
    });
    screen.widgets = widgets;
    console.log(screen.widgets);
    req.session.screen = screen;
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